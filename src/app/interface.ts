export interface LoanApplication {
  application_id: number;
  applicant_id: number;
  application_date: Date;
  amount: number;
  loan_type: string;
  is_approved_osds: string;
  is_approved_accounting: string;
  is_qualified: string;
}

export interface MergedLoanApplicationDetails {
  loan_details_id: number;
  loan_amount: number;
  type_of_loan: string;
  term: number;
  loan_application_number: number;
  purpose: string;
  borrowers_agreement: string;
  co_makers_agreement: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  date_submitted: Date;
  application_id: number;
  applicant_id: number;
  application_date: Date;
  amount: number;
  loan_type: string;
  is_approved_osds: string;
  is_approved_accounting: string;
  is_qualified: string;
}

export interface LoanApplicant {
  applicant_id: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  ext_name: string,
  designation: string,
  email: string
}

// export interface LoanDetails {
//   loan_details_id: number;
//   loan_amount: number;
//   type_of_loan: string;
//   term: number;
//   loan_application_number: number;
//   purpose: string;
//   borrowers_agreement: string;
//   co_makers_agreement: string;
//   applicant_id: number;
//   application_id: number;
//   last_name: string;
//   first_name: string;
//   middle_name: string;
//   date_submitted: Date;
//   is_approved_osds: string;
// }

export interface LoanDetails {
    loan_details_id: number;
    loan_amount: number;
    type_of_loan: string;
    term: number;
    loan_application_number: number;
    purpose: string;
    borrowers_agreement: string;
    co_makers_agreement: string;
    applicant_id: number;
    application_id: number;
    last_name: string;
    first_name: string;
    middle_name: string;
    date_submitted: Date;
    status: string;
}

export interface CoMakersInformation {
  co_makers_id: number;
  co_last_name: string;
  co_first_name: string;
  co_middle_initial: string;
  co_region: string;
  co_province: string;
  co_city: string;
  co_barangay: string;
  co_street: string;
  co_zipcode: number;
  co_employee_number: number;
  co_employment_status: string;
  co_date_of_birth: string;
  co_age: number;
  co_office: string;
  co_monthly_salary: number;
  co_office_tel_number: string;
  co_years_in_service: number;
  co_mobile_number: string;
  co_applicant_id: number;
  co_application_id: number;
}

export interface BorrowersInformation {
  borrowers_id: number;
  last_name: string;
  first_name: string;
  middle_initial: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  zipcode: number;
  employee_number: number;
  employment_status: string;
  date_of_birth: string;
  age: number;
  office: string;
  monthly_salary: number;
  office_tel_number: string;
  years_in_service: number;
  mobile_number: string;
  applicant_id: number;
  application_id: number;
}

export interface Staff {
  staff_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  ext_name: string;
  email: string;
  password: string;
  department_id: number;
}

export interface StaffProfile {
  staff_id: number;
  email: string;
  first_name: string;
  middle_name: string;
  ext_name: string | null;
  last_name: string;
  department_name: string;
}

export interface Response<T> {
  success: boolean,
  message: T
}

export interface Documents {
  cscAppointment_path: string;
  emergency_path: string;
  idComaker_path: string;
  idApplicant_path: string;
  authorityToDeduct_path: string;
  payslipApplicant_path: string;
  payslipComaker_path: string;
}

export interface RequiredDocuments {
  [key: string]: { title: string, src: string };
}

export interface DisplayDocuments {
  title: string;
  src: string
}

export interface Application {
  application_id: string,
  status: string,
  department_name: string,
  amount: string,
  loan_type: string,
  application_date: string,
  first_name: string,
  last_name: string,
  purpose: string
}

export interface UserProfile {
  applicant_id: number;
  email: string;
  first_name: string;
  middle_name: string;
  ext_name: string | null;
  last_name: string;
  designation: string;
}


interface ApplicationDetails {
  application_id: string,
  applicant_id: string,
  application_date: string,
  amount: string,
  loan_type: string,
  first_name: string,
  last_name: string,
  statuses: {
    office_id: string,
    status: string,
    updated_at: Date | null,
    office: string
  }
}


export interface PaidApplication extends Application {
  paid_date: string
}

export interface LoanApplication {
  application_id: number;
  applicant_id: number;
  application_date: Date;
  amount: number;
  loan_type: string;
  is_approved_osds: string;
  is_approved_accounting: string;
  is_qualified: string;
}

// export interface LoanDetails {
//   loan_details_id: number;
//   loan_amount: number;
//   type_of_loan: string;
//   term: number;
//   loan_application_number: number;
//   purpose: string;
//   borrowers_agreement: string;
//   co_makers_agreement: string;
//   applicant_id: number;
//   application_id: number;
//   last_name: string;
//   first_name: string;
//   middle_name: string;
//   date_submitted: Date;
//   is_approved_osds: string;
// }

export interface Applicant {
  applicant_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  ext_name: string;
  email: string;
  institution_name: string;
  position_id: number;
  designation: string;
}

export interface MergedLoanApplicationDetails {
  loan_details_id: number;
  loan_amount: number;
  type_of_loan: string;
  term: number;
  loan_application_number: number;
  purpose: string;
  borrowers_agreement: string;
  co_makers_agreement: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  date_submitted: Date;
  application_id: number;
  applicant_id: number;
  application_date: Date;
  amount: number;
  loan_type: string;
  is_approved_osds: string;
  is_approved_accounting: string;
  is_qualified: string;
}

export interface CoMakersInformation {
  co_makers_id: number;
  co_last_name: string;
  co_first_name: string;
  co_middle_initial: string;
  co_region: string;
  co_province: string;
  co_city: string;
  co_barangay: string;
  co_street: string;
  co_zipcode: number;
  co_employee_number: number;
  co_employment_status: string;
  co_date_of_birth: string;
  co_age: number;
  co_office: string;
  co_monthly_salary: number;
  co_office_tel_number: string;
  co_years_in_service: number;
  co_mobile_number: string;
  co_applicant_id: number;
  co_application_id: number;
}

export interface BorrowersInformation {
  borrowers_id: number;
  last_name: string;
  first_name: string;
  middle_initial: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  zipcode: number;
  employee_number: number;
  employment_status: string;
  date_of_birth: string;
  age: number;
  office: string;
  monthly_salary: number;
  office_tel_number: string;
  years_in_service: number;
  mobile_number: string;
  applicant_id: number;
  application_id: number;
}

export interface Staff {
  staff_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  ext_name: string;
  email: string;
  password: string;
  department_id: number;
}

export interface Assessment {
  assessment_id: number;
  loan_application_form: string;
  authorization_to_deduct: string;
  latest_pay_slip: string;
  photocopy_deped_id: string;
  approved_appointment: string;
  proof_co_terminus: string;
  others: string;
  letter_of_request: string;
  hospitalization: string;
  medical_abstract: string;
  barangay: string;
  signed_filled_laf: string;
  complete_supporting_documents: string;
  authorized_signature_laf: string;
  borrower_reaches_retirement: string;
  borrowers_age: number;
  comakers_reaches_retirement: string;
  comakers_age: number;
  borrowers_has_outstanding_balance: string;
  current_loan_balance: number;
  past_due_loan: number;
  number_of_years_past_due: number;
  number_of_months_past_due: number;
  borrowers_take_home_pay: string;
  paid_30_percent: string;
  percentage_of_principal_paid: number;
  principal_loan_amount: number;
  principal: number;
  interest: number;
  net_proceeds: number;
  net_take_home_pay_after_deduction: number;
  monthly_amortization: number;
  period_of_loan: number;
  date_processed: Date;
  processed_by: string;
  reviewed_by: string;
  remarks: string;
  application_id: number;
}

export interface SignatureDetails {
  signature_id: number;
  application_id: number;
  staff_id_hr: number;
  staff_id_admin: number;
  staff_id_legal: number;
  signature_hr: string;
  signature_admin: string;
  signature_legal: string;
  date_submitted: Date;
}

export interface ApprovalDetails {
  approval_id: number;
  application_id: number;
  staff_id_asds: number;
  status_asds: string;
  staff_id_sds: number;
  status_sds: string;
  date_submitted: Date;
}

export interface DepartmentStatus {
  status_id: number;
  application_id: number;
  department_id: number;
  status: string;
  updated_at: Date;
}

export interface AssessmentForm {
  assessment_id: number;
  application_id: number;
  loan_application_form: string;
  authorization_to_deduct: string;
  latest_pay_slip: string;
  photocopy_deped_id: string;
  approved_appointment: string;
  proof_co_terminus: string;
  others: string;
  letter_of_request: string;
  hospitalization: string;
  medical_abstract: string;
  barangay: string;
  signed_filled_laf: string;
  complete_supporting_documents: string;
  authorized_signature_laf: string;
  borrower_reaches_retirement: string;
  borrowers_age: number;
  comakers_reaches_retirement: string;
  comakers_age: number;
  borrowers_has_outstanding_balance: string;
  current_loan_balance: number;
  past_due_loan: string;
  number_of_years_past_due: number;
  number_of_months_past_due: number;
  borrowers_take_home_pay: number;
  paid_30_percent: string;
  percentage_of_principal_paid: number;
  principal_loan_amount: number;
  principal: number;
  interest: number;
  net_proceeds: number;
  net_take_home_pay_after_deduction: number;
  monthly_amortization: number;
  period_of_loan: number;
  date_processed: Date;
  processed_by: string;
  reviewed_by: string;
  remarks: string;
}
