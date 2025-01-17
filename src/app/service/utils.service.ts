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
    "status": "Status"
  }

  constructor() { }


  parseHeader(data: Application[]) {

    console.log(data)
    const headers = Object.keys(data[Object.keys(data)[0] as any]).filter(key => key !== "statuses");  // Get the headers by filtering out the "statuses" field

    const headerTranslate = headers.map(item => this.headerDict[item])
    const rows = [];

    // Iterate through each application and extract the data into rows
    for (const key in data) {
      const row = [] as any[];
      headers.forEach((header: any) => {
        row.push(data[key][header] as any);  // Push the corresponding value to the row
      });
      rows.push(row);
    }

    return {
      headers: headerTranslate,  // Table headers
      rows: rows         // Table rows
    };

  }

  parseBody() { }
}
