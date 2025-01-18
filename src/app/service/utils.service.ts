import { Injectable } from '@angular/core';
import { Application, PaidApplication } from '../interface';
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
    "purpose": "purpose",
    "paid_date": "Paid Date"
  }

  constructor() { }


  parseData(
    data: Application[] | PaidApplication[],
    status?: string,
    office?: string,
    offices?: string[]
  ) {
    let filterData;

    // Filter
    if (status && (office || offices)) {
      if (office) {
        filterData = data.filter(
          item =>
            item.office_name.toLowerCase() === office.toLowerCase() &&
            item.status.toLowerCase() === status.toLowerCase()
        );
      } else {
        filterData = data.filter(
          item =>
            offices!.map(o => o.toLowerCase()).includes(item.office_name.toLowerCase()) &&
            item.status.toLowerCase() === status.toLowerCase()
        );
      }
    } else {
      filterData = [...data];
    }

    if (filterData.length < 1) {
      return {
        headers: [],
        rows: []
      };
    }

    // data sequence
    const baseSequence: string[] = [
      "application_id",
      "applicant_id",
      "first_name",
      "last_name",
      "loan_type",
      "amount",
      "application_date",
      "status",
      "office_name",
      "purpose",
      "paid_date"
    ];

    // Filter sequence based on available keys in data
    const availableKeys = Object.keys(filterData[0]);
    const sequence = baseSequence.filter(key => availableKeys.includes(key));

    // Reordering data based on sequence
    const reorderedData = filterData.map((item: any) => {
      const reorderedItem: any = {};
      sequence.forEach(key => {
        reorderedItem[key] = item[key] ?? null;
      });
      return reorderedItem;
    });

    // Map headers using sequence
    const headerTranslate = sequence.map(key => this.headerDict[key]).filter(Boolean);

    // Extract rows
    const rows = reorderedData.map(item => Object.values(item)) as string[][];

    console.log(rows)
    return {
      headers: headerTranslate,
      rows: rows
    };
  }



}
