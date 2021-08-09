import {AppUser} from "../../../_model/user";
import {HabilitationLevel} from "../../../_model/question";

export class XEntreprise {
  id: number;
  xSupAdminEntreprise: XSupAdminEntreprise;
}

export class XEmployeeEntreprise {
  id: number;
  appUser: AppUser;
  poste: string;
  telephone: string;
  dateNaissance: Date;
  dateEmbauche: Date;
  xpositionTestList: Array<XPositionTest>;
  xsessions: Array<XSession>;
  constructor() {

  }
}

export class XPositionTest {
  id: number;
  enable: boolean ;
  habilitationLevel: HabilitationLevel;
}

export class XSapAdminEntreprise {
  id: number;
  appUser: AppUser;
  xemployeeEntreprises: Array<XEmployeeEntreprise>;
}

export class XSession {
  id: number;
  habilitationLevel: HabilitationLevel;
  initial: boolean;
}

export class XSupAdminEntreprise {
  id: number;
  appUser: AppUser;
  xSapAdminEntrepriseList: Array<XSapAdminEntreprise>;
}
