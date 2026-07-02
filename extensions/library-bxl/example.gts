import { CardDef, contains, containsMany, field } from 'https://cardstack.com/base/card-api';
import BooleanField from 'https://cardstack.com/base/boolean';
import NumberField from 'https://cardstack.com/base/number';
import StringField from 'https://cardstack.com/base/string';

import { expression } from '../bxl';
import {
  BillingField,
  MedicationOrderField,
  VitalsField,
} from './hospital-fields';

export class HospitalPatient extends CardDef {
  static displayName = 'Hospital Patient';

  @field patientId = contains(StringField);
  @field firstName = contains(StringField);
  @field lastName = contains(StringField);
  @field dob = contains(StringField);
  @field gender = contains(StringField);
  @field bloodType = contains(StringField);
  @field admissionDate = contains(StringField);
  @field dischargeDate = contains(StringField);
  @field ward = contains(StringField);
  @field diagnosis = contains(StringField);
  @field severity = contains(StringField);
  @field today = contains(StringField);
  @field vitals = contains(VitalsField);
  @field billing = contains(BillingField);
  @field medications = containsMany(MedicationOrderField);

  @field fullName = contains(StringField, {
    computeVia: expression('.firstName + " " + .lastName'),
  });
  @field patientIdUpper = contains(StringField, {
    computeVia: expression('.patientId | ascii_upcase'),
  });
  @field diagnosisHasTion = contains(BooleanField, {
    computeVia: expression('.diagnosis | test("tion"; "i")'),
  });
  @field wardNameLength = contains(NumberField, {
    computeVia: expression('.ward | length'),
  });
  @field stayDays = contains(NumberField, {
    computeVia: expression(
      '(((.dischargeDate | strptime("%Y-%m-%d") | mktime) - (.admissionDate | strptime("%Y-%m-%d") | mktime)) / 86400) | floor',
    ),
  });
  @field ageYears = contains(NumberField, {
    computeVia: expression(
      '(((.today | strptime("%Y-%m-%d") | mktime) - (.dob | strptime("%Y-%m-%d") | mktime)) / 31557600) | floor',
    ),
  });
  @field admissionMonth = contains(StringField, {
    computeVia: expression(
      '.admissionDate | strptime("%Y-%m-%d") | strftime("%B %Y")',
    ),
  });
  @field daysSinceAdmission = contains(NumberField, {
    computeVia: expression(
      '(((.today | strptime("%Y-%m-%d") | mktime) - (.admissionDate | strptime("%Y-%m-%d") | mktime)) / 86400) | floor',
    ),
  });
  @field medicationCount = contains(NumberField, {
    computeVia: expression('.medications | length'),
  });
  @field totalBillUSD = contains(NumberField, {
    computeVia: expression(
      '.billing.roomCharge + .billing.procedures + .billing.pharmacy',
    ),
  });
  @field mockEmail = contains(StringField, {
    computeVia: expression(
      '(.firstName + "." + .lastName + "@hospital.org") | ascii_downcase',
    ),
  });
}
