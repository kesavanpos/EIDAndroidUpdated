import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import * as application from 'tns-core-modules/application';
import { ImageSource } from "tns-core-modules/image-source";
import * as dialogs from "tns-core-modules/ui/dialogs";

declare var ae:any;
declare var com:any;

import { CardData,ModifiablePublicData,NonModifiablePublicData,HomeAddress,WorkAddress } from "../../models/CardData"

declare var android:any;

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    publicData:any;
    toolkit:any;
    cardReader:any;
    tag : any;
    cardData:CardData;
    private _imageSource: ImageSource;

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }

    ConnectReader(event)
    {
        if(this.toolkit != null)
        {
          try
          {
            this.cardReader = ae.emiratesid.idcard.toolkit.sample.ConnectionController.initConnection(this.toolkit,application.android.context);
          }
          catch(e)
          {
            dialogs.alert("ConnectReader Error :" + e.message).then(()=> {
                console.log("Dialog closed!");
            });  
          }
        }
        else
        {
          dialogs.alert("Toolkit is null").then(()=> {
              console.log("Dialog closed!");
          });  
        }
    }

    onTap(event)
    {
        var context = application.android.context;   
        //let env = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/EIDAToolkit/";        
        var pluginDirectorPath = context.getApplicationInfo().nativeLibraryDir + "/";
        var configParams = '\n';		
        configParams += 'config_directory =/storage/emulated/0/EIDAToolkit/' ;
        configParams += '\n';
        configParams += 'log_directory =/storage/emulated/0/EIDAToolkit/';
        configParams += '\n';
        configParams +=  'read_publicdata_offline = true';
        configParams += '\n';        
        configParams += 'vg_url = http://172.16.11.13/ValidationGatewayService';
        configParams += '\n';        
        configParams += 'plugin_directory_path ='+pluginDirectorPath;        
        
        try{            
            // let conn = new ae.emiratesid.idcard.toolkit.sample.ConnectionController();
            // conn.show(application.android.context);
            this.toolkit = ae.emiratesid.idcard.toolkit.sample.ConnectionController.initialize(application.android.context);            
        }
        catch(e)
        {
            dialogs.alert("Got Toolkit Error " +  e.message).then(()=> {
                console.log("Dialog closed!");
            }); 
        }        
    }

    cardholderimage : any;
    cardHolderImage : any;
    checksign:boolean=false;
    ShowPublicData(event){

        if(this.toolkit != null && this.cardReader != null)
        {
            try
            {
                this.publicData = ae.emiratesid.idcard.toolkit.sample.ConnectionController.GetPublicData
                (this.cardReader,application.android.context);            
               
                this.items=[];

                this.AddItems("CardNumber",this.publicData.getCardNumber());
                this.AddItems("IdNumber",this.publicData.getIdNumber());

                this.checksign =true;

               var bitMap = ae.emiratesid.idcard.toolkit.sample.ConnectionController.displayPhoto(this.publicData);
               
                this._imageSource = new ImageSource();   
                this._imageSource.setNativeSource(bitMap);

                this.cardHolderImage = this._imageSource;
                

                this.AddItems("---------------------------","");
                this.AddItems("ModificableData","");
                this.GetModData();
                this.AddItems("---------------------------","");
                this.AddItems("ModificableData","");
                this.AddItems("---------------------------","");
                this.AddItems("NonModificableData","");
                this.GetNonModData();
                this.AddItems("NonModificableData","");
                this.AddItems("---------------------------","");
                this.AddItems("HomeAddress","");
                this.AddItems("---------------------------","");
                this.GetHomeAddress();
                this.AddItems("HomeAddress","");
                this.AddItems("---------------------------","");
                this.AddItems("GetWorkAddress","");
                this.AddItems("---------------------------","");
                this.GetWorkAddress();
                this.AddItems("GetWorkAddress","");
                this.AddItems("---------------------------","");
    
                dialogs.alert("Records Retrieved Successfully !").then(()=> {
                    console.log("Dialog closed!");
                });
            }
            catch(e)
            {
                dialogs.alert("ShowPublicData Error " +  e.message).then(()=> {
                    console.log("Dialog closed!");
                });
            }
        }
        else if(this.toolkit == null)
        {
            dialogs.alert("Toolkit is null").then(()=> {
                console.log("Dialog closed!");
            });
        }
        else if(this.cardReader == null)
        {
            dialogs.alert("CardReader is null").then(()=> {
                console.log("Dialog closed!");
            });
        }
    }

    AddItems(Entity,EntityValue)
    {
        try
        {
            if(EntityValue != null && EntityValue != undefined)
            this.items.push(
                {
                    id:this.items.length + 1,
                    name:Entity,
                    role:EntityValue
                });
        }
        catch(e)
        {

        }
        
    }

    GetWorkAddress()
    {
        this.AddItems("AddressTypeCode",this.publicData.getWorkAddress().getAddressTypeCode());
        this.AddItems("LocationCode",this.publicData.getWorkAddress().getLocationCode());
        this.AddItems("CompanyNameArabic",this.publicData.getWorkAddress().getCompanyNameArabic());
        this.AddItems("CompanyNameEnglish",this.publicData.getWorkAddress().getCompanyNameEnglish());
        this.AddItems("EmiratesCode",this.publicData.getWorkAddress().getEmiratesCode());
        this.AddItems("EmiratesDescArabic",this.publicData.getWorkAddress().getEmiratesDescArabic());
        this.AddItems("EmiratesDescEnglish",this.publicData.getWorkAddress().getEmiratesDescEnglish());
        this.AddItems("CityCode",this.publicData.getWorkAddress().getCityCode());
        this.AddItems("CityDescArabic",this.publicData.getWorkAddress().getCityDescArabic());
        this.AddItems("CityDescEnglish",this.publicData.getWorkAddress().getCityDescEnglish());
        this.AddItems("POBOX",this.publicData.getWorkAddress().getPOBOX());
        this.AddItems("StreetArabic",this.publicData.getWorkAddress().getStreetArabic());

        this.AddItems("AreaCode",this.publicData.getWorkAddress().getAreaCode());
        this.AddItems("StreetEnglish",this.publicData.getWorkAddress().getStreetEnglish());
        this.AddItems("AreaCode",this.publicData.getWorkAddress().getAreaCode());
        this.AddItems("AreaDescArabic",this.publicData.getWorkAddress().getAreaDescArabic());

        this.AddItems("AreaDescEnglish",this.publicData.getWorkAddress().getAreaDescEnglish());
        this.AddItems("BuildingNameArabic",this.publicData.getWorkAddress().getBuildingNameArabic());
        this.AddItems("BuildingNameEnglish",this.publicData.getWorkAddress().getBuildingNameEnglish());
        this.AddItems("LandPhoneNumber",this.publicData.getWorkAddress().getLandPhoneNumber());

        this.AddItems("MobilePhoneNumber",this.publicData.getWorkAddress().getMobilePhoneNumber());
        this.AddItems("Email",this.publicData.getWorkAddress().getEmail());
    }

    GetHomeAddress()
    {
        this.AddItems("AddressTypeCode",this.publicData.getHomeAddress().getAddressTypeCode());
        this.AddItems("LocationCode",this.publicData.getHomeAddress().getLocationCode());
        this.AddItems("EmiratesCode",this.publicData.getHomeAddress().getEmiratesCode());

        this.AddItems("EmiratesDescArabic",this.publicData.getHomeAddress().getEmiratesDescArabic());
        this.AddItems("EmiratesDescEnglish",this.publicData.getHomeAddress().getEmiratesDescEnglish());
        this.AddItems("CityCode",this.publicData.getHomeAddress().getCityCode());

        this.AddItems("CityDescArabic",this.publicData.getHomeAddress().getCityDescArabic());
        this.AddItems("CityDescEnglish",this.publicData.getHomeAddress().getCityDescEnglish());
        this.AddItems("StreetArabic",this.publicData.getHomeAddress().getStreetArabic());

        this.AddItems("StreetEnglish",this.publicData.getHomeAddress().getStreetEnglish());
        this.AddItems("POBOX",this.publicData.getHomeAddress().getPOBOX());
        this.AddItems("AreaCode",this.publicData.getHomeAddress().getAreaCode());

        this.AddItems("AreaDescArabic",this.publicData.getHomeAddress().getAreaDescArabic());
        this.AddItems("AreaDescEnglish",this.publicData.getHomeAddress().getAreaDescEnglish());
        this.AddItems("BuildingNameArabic",this.publicData.getHomeAddress().getBuildingNameArabic());

        this.AddItems("BuildingNameEnglish",this.publicData.getHomeAddress().getBuildingNameEnglish());
        this.AddItems("FlatNo",this.publicData.getHomeAddress().getFlatNo());
        this.AddItems("ResidentPhoneNumber",this.publicData.getHomeAddress().getResidentPhoneNumber());

        this.AddItems("MobilePhoneNumber",this.publicData.getHomeAddress().getMobilePhoneNumber());
        this.AddItems("Email",this.publicData.getHomeAddress().getEmail());
        
    }

    GetNonModData()
    {
        this.AddItems("IDType",this.publicData.getNonModifiablePublicData().getIDType());
        this.AddItems("IssueDate",this.publicData.getNonModifiablePublicData().getIssueDate());
        this.AddItems("ExpiryDate",this.publicData.getNonModifiablePublicData().getExpiryDate());
        this.AddItems("DateofBirth",this.publicData.getNonModifiablePublicData().getDateOfBirth());

        this.AddItems("TitleArabic",this.publicData.getNonModifiablePublicData().getTitleArabic());
        this.AddItems("FullNameArabic",this.publicData.getNonModifiablePublicData().getFullNameArabic());
        this.AddItems("TitleEnglish",this.publicData.getNonModifiablePublicData().getTitleEnglish());
        this.AddItems("FullNameEnglish",this.publicData.getNonModifiablePublicData().getFullNameEnglish());

        this.AddItems("Gender",this.publicData.getNonModifiablePublicData().getGender());
        this.AddItems("NationalityArabic",this.publicData.getNonModifiablePublicData().getNationalityArabic());
        this.AddItems("NationalityEnglish",this.publicData.getNonModifiablePublicData().getNationalityEnglish());

        this.AddItems("NationalityCode",this.publicData.getNonModifiablePublicData().getNationalityCode());
        this.AddItems("PlaceOfBirthArabic",this.publicData.getNonModifiablePublicData().getPlaceOfBirthArabic());
        this.AddItems("PlaceOfBirthEnglish",this.publicData.getNonModifiablePublicData().getPlaceOfBirthEnglish());
    }

    GetModData()
    {

        this.AddItems("OccupationCode",this.publicData.getModifiablePublicData().getOccupationCode());
        this.AddItems("OccupationArabic",this.publicData.getModifiablePublicData().getOccupationArabic());        
        this.AddItems("companyNameEnglish",this.publicData.getModifiablePublicData().getCompanyNameEnglish());        

        this.AddItems("occupationEnglish",this.publicData.getModifiablePublicData().getOccupationEnglish());
        this.AddItems("familyID",this.publicData.getModifiablePublicData().getFamilyID());
        this.AddItems("occupationTypeArabic",this.publicData.getModifiablePublicData().getOccupationTypeArabic());
        this.AddItems("occupationTypeEnglish",this.publicData.getModifiablePublicData().getOccupationTypeEnglish());

        this.AddItems("occupationFieldCode",this.publicData.getModifiablePublicData().getOccupationFieldCode());
        this.AddItems("companyNameArabic",this.publicData.getModifiablePublicData().getCompanyNameArabic());
        
        this.AddItems("occupationTypeArabic",this.publicData.getModifiablePublicData().getOccupationTypeArabic());
        this.AddItems("maritalStatusCode",this.publicData.getModifiablePublicData().getMaritalStatusCode());

        this.AddItems("husbandIDN",this.publicData.getModifiablePublicData().getHusbandIDN());
        this.AddItems("sponsorTypeCode",this.publicData.getModifiablePublicData().getSponsorTypeCode());
        this.AddItems("sponsorUnifiedNumber",this.publicData.getModifiablePublicData().getSponsorUnifiedNumber());
        this.AddItems("maritalStatusCode",this.publicData.getModifiablePublicData().getMaritalStatusCode());

        this.AddItems("sponsorName",this.publicData.getModifiablePublicData().getSponsorName());
        this.AddItems("residencyTypeCode",this.publicData.getModifiablePublicData().getResidencyTypeCode());
        this.AddItems("residencyNumber",this.publicData.getModifiablePublicData().getResidencyNumber());
        this.AddItems("residencyExpiryDate",this.publicData.getModifiablePublicData().getResidencyExpiryDate());

        this.AddItems("passportNumber",this.publicData.getModifiablePublicData().getPassportNumber());
        this.AddItems("passportTypeCode",this.publicData.getModifiablePublicData().getPassportTypeCode());
        this.AddItems("passportCountryCode",this.publicData.getModifiablePublicData().getPassportCountryCode());
        this.AddItems("passportCountryDescArabic",this.publicData.getModifiablePublicData().getPassportCountryDescArabic());
                
        this.AddItems("passportCountryDescEnglish",this.publicData.getModifiablePublicData().getPassportNumber());
        this.AddItems("PassportIssueDate",this.publicData.getModifiablePublicData().getPassportIssueDate());
        this.AddItems("PassportExpiryDate",this.publicData.getModifiablePublicData().getPassportExpiryDate());
        this.AddItems("QualificationLevelCode",this.publicData.getModifiablePublicData().getQualificationLevelCode());
                
        this.AddItems("QualificationLevelDescArabic",this.publicData.getModifiablePublicData().getQualificationLevelDescArabic());
        this.AddItems("QualificationLevelDescEnglish",this.publicData.getModifiablePublicData().getQualificationLevelDescEnglish());
        this.AddItems("DegreeDescArabic",this.publicData.getModifiablePublicData().getDegreeDescArabic());
        this.AddItems("DegreeDescEnglish",this.publicData.getModifiablePublicData().getDegreeDescEnglish());
                
        this.AddItems("DegreeDescEnglish",this.publicData.getModifiablePublicData().getDegreeDescEnglish());
        this.AddItems("FieldOfStudyArabic",this.publicData.getModifiablePublicData().getFieldOfStudyArabic());
        this.AddItems("FieldOfStudyEnglish",this.publicData.getModifiablePublicData().getFieldOfStudyEnglish());
        this.AddItems("PlaceOfStudyArabic",this.publicData.getModifiablePublicData().getPlaceOfStudyArabic());

        this.AddItems("DateOfGraduation",this.publicData.getModifiablePublicData().getDateOfGraduation());
        this.AddItems("MotherFullNameArabic",this.publicData.getModifiablePublicData().getMotherFullNameArabic());
        this.AddItems("MotherFullNameEnglish",this.publicData.getModifiablePublicData().getMotherFullNameEnglish());
        this.AddItems("FieldOfStudyCode",this.publicData.getModifiablePublicData().getFieldOfStudyCode());
    }

    GetToolkitVersion(event)
    {
        let toolkitversion = this.toolkit.getToolkitVerison();
        dialogs.alert("GetToolkitVersion " +  toolkitversion).then(()=> {
            console.log("Dialog closed!");
        });
    }
}
