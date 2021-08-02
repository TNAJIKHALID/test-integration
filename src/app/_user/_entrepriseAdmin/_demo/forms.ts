
export class AddXEmployeeForm{
   level: string;
   type: boolean;
   /*time: number;
   admissionBarrier:number;
   numberOfQuestions:number;*/


   firstName: string;
   lastName: string;
   email: string;
   poste: string;
   dateNaissance;
   dateEmbauche;
   telephone: string;
   constructor() {
   }
}

export class AddSessionForm{
  level:string;
  employees:Array<AddXEmployeeFrom>;
}

export class AddXEmployeeFrom{
  type: boolean;
  firstName: string;
  lastName: string;
  email: string;
  poste: string;
  dateNaissance;
  dateEmbauche;
  telephone: string;
  constructor() {
  }
}
