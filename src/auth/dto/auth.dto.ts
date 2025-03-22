import { Length, IsNotEmpty, IsNumber, Min, Max, Matches, IsEmail, IsPhoneNumber, IsDateString, IsString, IsDate, MinDate, MaxDate, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/*
export class AuthSignUpDto {
  @IsNotEmpty({ message: 'common.validation.required_field' })
  @IsEmail({}, { message: 'common.validation.invalid_email' })
  email: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(8, 20, {
    message: 'common.validation.invalid_length',
    context: { min: 8, max: 20 }
  })
  password: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(8, 20, {
    message: 'common.validation.invalid_length',
    context: { min: 8, max: 20 , Name:"Jean" }
  })
  firstName: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(8, 20, {
    message: 'common.validation.invalid_length',
    context: { min: 8, max: 20 , Name:"Jean" }
  })
  laststName: string;

  @Type(() => Number) // ✅ Convertit `age` en `number` automatiquement
  @IsNumber({}, { message: 'common.validation.invalid_format' })
  @Min(10, { message: 'common.validation.invalid_length', context: { min: 10 } })
  age: number;

  @Matches(/^[A-Z]+$/, { message: 'common.validation.only_uppercase' })
  code: string;
}*/

export class AuthSignUpDto {
  @IsNotEmpty({ message: 'common.validation.required_field' })
  @IsEmail({}, { message: 'common.validation.invalid_email' })
  email: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(8, 20, {
    message: 'common.validation.invalid_length',
    context: { min: 6, max: 20 }
  })
  @Matches(/^.*(?=.*[A-Z]).*$/, { message: 'common.validation.password_uppercase_required' })
  password: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Matches(/^.*(?=.*[A-Z]).*$/, { message: 'common.validation.password_uppercase_required' })
  @ValidateIf((o) => o.password !== o.confirmPassword)
    @Matches(/^$/, { message: 'common.validation.password_mismatch' }) // Cette regex échoue toujours
  confirmPassword: string;

  
  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(2, 100, {
    message: 'common.validation.invalid_length',
    context: { min: 2, max: 100, Name: "Jean" }
  })
  firstName: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(2, 100, {
    message: 'common.validation.invalid_length',
    context: { min: 2, max: 100, Name: "Jean" }
  })
  lastName: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'common.validation.invalid_phone' })
  phone: string;
  
  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Transform(({ value }) => new Date(value)) // ✅ Transforme toujours en `Date`
  @IsDate({ message: 'common.validation.invalid_date_of_birth' }) // ✅ Vérifie que c'est bien une date
  @MinDate(new Date('1900-01-01'), { message: 'common.validation.too_old' }) // ✅ Vérifie que c'est après 1900
  @MaxDate(new Date(), { message: 'common.validation.future_date' }) // ✅ Pas dans le futur
  dateOfBirth: Date;

  

 
 /*

  to api rest 
  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Type(() => Date) // Transforme la chaîne en objet Date
  @IsDateString({}, { message: 'common.validation.invalid_date_of_birth' })
  dateOfBirth: Date; // Maintenant c'est un objet Date
  
  
Si ton API attend une personne adulte (18 ans minimum), la validation pourrait être :


@MinDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
Dans ce cas, 2018-02-07 est refusé car la personne a moins de 18 ans.

{
  "email": "test@example.com",
  "password": "SecurePass1",
  "confirmPassword": "SecurePass1",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+33612345678",
  "dateOfBirth": "1995-06-15"
}


  */



 
}

export class AuthSignInDto {
  @IsNotEmpty({ message: 'common.validation.required_field' })
  @IsEmail({}, { message: 'common.validation.invalid_email' })
  email: string;

  @IsNotEmpty({ message: 'common.validation.required_field' })
  @Length(8, 20, {
    message: 'common.validation.invalid_length',
    context: { min: 6, max: 20 }
  })
  @Matches(/^.*(?=.*[A-Z]).*$/, { message: 'common.validation.password_uppercase_required' })
  password: string;
}


/*good with traduction 
export class AuthDto {
    @IsNotEmpty({ message: 'common.validation.required_field' })
    @IsEmail({}, { message: 'common.validation.invalid_email' })
    email: string;
    
    @IsString({ message: 'common.validation.invalid_format' })
    @IsNotEmpty({ message: 'common.validation.required_field' })
    @Length(10, 20, {
        message: 'common.validation.invalid_length',
        context: { min: 10, max: 20 }, // 🔥 Passe `min` et `max` ici !
      })
    password: string;

    @IsNotEmpty({ message: 'common.welcome', context: { Name: "Carine"} })
    test: string;
}
*/

/*

export class AuthDto {
  @IsNotEmpty({ message: 'common.validation.required_field' })
  email: string;

  @Length(8, 20, {
    message: 'common.validation.invalid_length',
    context: { min: 8, max: 20 } // ✅ Passage des variables via `context`
  })
  @IsNotEmpty({ message: 'common.validation.required_field' })
  password: string;

  @Length(8, 20, {
        message: 'common.validation.invalid_length',
        context: { min: 8, max: 20 , Name:"jean"} // ✅ Passage des variables via `context`
      })
  nom: string;

  @IsNumber()
  @Min(10, { message: 'common.validation.invalid_length', context: { min: 10 } }) // ✅ Utilisation de `context`
  age: number;

  @Matches(/^[A-Z]+$/, { message: 'common.validation.only_uppercase' }) // ✅ Message sans variable
  code: string;
}

*/