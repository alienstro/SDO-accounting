import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ApplicantImportData, StaffImportData } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class ExcelimportService {

  constructor() { }

  parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Skip header row and convert to objects
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const result = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
            });
            return obj;
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  validateApplicantData(data: any[]): { valid: ApplicantImportData[], errors: string[] } {
    const valid: ApplicantImportData[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; 
      const rowErrors: string[] = [];

      // Required field validation
      if (!row.first_name?.trim()) rowErrors.push(`Row ${rowNumber}: First Name is required`);
      if (!row.last_name?.trim()) rowErrors.push(`Row ${rowNumber}: Last Name is required`);
      if (!row.email?.trim()) rowErrors.push(`Row ${rowNumber}: Email is required`);
      if (!row.password?.trim()) rowErrors.push(`Row ${rowNumber}: Password is required`);
      if (!row.institution_name?.trim()) rowErrors.push(`Row ${rowNumber}: Institution Name is required`);
      if (!row.designation?.trim()) rowErrors.push(`Row ${rowNumber}: Designation is required`);

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.email && !emailRegex.test(row.email.trim())) {
        rowErrors.push(`Row ${rowNumber}: Invalid email format`);
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else {
        valid.push({
          first_name: row.first_name.trim(),
          middle_name: row.middle_name?.trim() || '',
          last_name: row.last_name.trim(),
          ext_name: row.ext_name?.trim() || '',
          email: row.email.trim(),
          password: row.password.trim(),
          institution_name: row.institution_name.trim(),
          designation: row.designation.trim()
        });
      }
    });

    return { valid, errors };
  }

  validateStaffData(data: any[]): { valid: StaffImportData[], errors: string[] } {
    const valid: StaffImportData[] = [];
    const errors: string[] = [];

    const validDepartments = ['1', '2', '3', '4', '5', '6']; // HR, Legal, Admin, Accounting, ASDS, OSDS

    data.forEach((row, index) => {
      const rowNumber = index + 2;
      const rowErrors: string[] = [];

      // Required field validation
      if (!row.first_name?.trim()) rowErrors.push(`Row ${rowNumber}: First Name is required`);
      if (!row.last_name?.trim()) rowErrors.push(`Row ${rowNumber}: Last Name is required`);
      if (!row.email?.trim()) rowErrors.push(`Row ${rowNumber}: Email is required`);
      if (!row.password?.trim()) rowErrors.push(`Row ${rowNumber}: Password is required`);
      if (!row.department_id?.toString().trim()) rowErrors.push(`Row ${rowNumber}: Department ID is required`);
      if (!row.designation?.trim()) rowErrors.push(`Row ${rowNumber}: Designation is required`);

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.email && !emailRegex.test(row.email.trim())) {
        rowErrors.push(`Row ${rowNumber}: Invalid email format`);
      }

      // Department validation
      if (row.department_id && !validDepartments.includes(row.department_id.toString().trim())) {
        rowErrors.push(`Row ${rowNumber}: Invalid Department ID. Must be 1-6 (1=HR, 2=Legal, 3=Admin, 4=Accounting, 5=ASDS, 6=OSDS)`);
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else {
        valid.push({
          first_name: row.first_name.trim(),
          middle_name: row.middle_name?.trim() || '',
          last_name: row.last_name.trim(),
          ext_name: row.ext_name?.trim() || '',
          email: row.email.trim(),
          password: row.password.trim(),
          department_id: row.department_id.toString().trim(),
          designation: row.designation.trim()
        });
      }
    });

    return { valid, errors };
  }

  generateApplicantTemplate(): void {
    const template = [
      ['First Name', 'Middle Name', 'Last Name', 'Ext Name', 'Email', 'Password', 'Institution Name', 'Designation'],
      ['Robinx Prhynz', 'Mas', 'Aquino', '', 'robinxaquino@example.com', 'test1234', 'Gordon College', 'Student'],
      ['Juan', '', 'Dela Cruz', '', 'juandelacruz@example.com', 'test1234', 'Gordon College', 'Programmer X']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');
    XLSX.writeFile(workbook, 'applicant_import_template.xlsx');
  }

  generateStaffTemplate(): void {
    const template = [
      ['First Name', 'Middle Name', 'Last Name', 'Ext Name', 'Email', 'Password', 'Department ID', 'Designation'],
      ['Robinx Prhynz', 'Mas', 'Aquino', '', 'robinxaquino@example.com', 'test1234', '1', 'HR VII'],
      ['Juan', '', 'Dela Cruz', 'Sr', 'juandelacruz@example.com', 'test1234', '4', 'Accountant V']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff');
    XLSX.writeFile(workbook, 'staff_import_template.xlsx');
  }
}