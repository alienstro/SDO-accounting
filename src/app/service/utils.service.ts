import { Injectable } from '@angular/core';
import { Application } from '../interface';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  headerDict: { [key: string]: string } = {
    "amount": "Loan Amount",
    "applicant_id": "Applicant #",
    "application_date": "Date Submitted",
    "application_id": "Application #",
    "first_name": "First Name",
    "last_name": "Last Name",
    "loan_type": "Type of Loan",
    "status": "Status",
    "office_name": "Office",
    "purpose": "purpose"
  }

  constructor() { }


  // Can filter now
  parseHeader(data: Application[], status?: string, office?: string, offices?: string[]) {

    let filterData

    if (status && (office || offices)) {

      if (office) {
        filterData = data.filter(item => item.office_name.toLowerCase() === office.toLowerCase() && item.status.toLowerCase() === status.toLowerCase())
      } else {
        filterData = data.filter(item => offices!.includes(item.office_name.toLowerCase()) && item.status.toLowerCase() === status.toLowerCase())
      }
    } else {
      filterData = [...data]
    }

    if (filterData.length < 1) {
      return {
        headers: [],  // Table headers
        rows: []         // Table rows
      };
    }

    const headerTranslate = Object.keys(filterData[0]).map((item: string) => this.headerDict[item])

    const rows: any = [];

    filterData.forEach((item: any) => rows.push(Object.values(item)))

    return {
      headers: headerTranslate,  // Table headers
      rows: rows         // Table rows
    };

  }

  parseBody() { }
}
