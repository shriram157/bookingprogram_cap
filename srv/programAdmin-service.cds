using Core as core from '../db/Core';
using ProgramAdmin as bookingadmin from '../db/BookingAdmin';
using ProgramBooking as booking from '../db/ProgramBooking';
using DEALERBOOKINGVENDORREPORTCALCULATION from '../db/calcviews';
using DEALERBOOKINGREPORTCALCULATION from '../db/calcviews';
using PROGRAMPERIODSMETA from '../db/calcviews';
using DEALERBOOKINGSTATUSSUMMARYVIEW from '../db/calcviews';
using DEALERBOOKINGSTATUS from '../db/calcviews';
using DEALERBOOKINGCATEGORYDELIVERYVIEW from '../db/calcviews';
using DEALERBOOKINGCATEGORYDELIVERYSCHEDULEVIEW from '../db/calcviews';
using DEALERBOOKINGPARTPERIODVIEW from '../db/calcviews';
using DEALERBOOKINGPARTVENDORPERIODVIEW from '../db/calcviews';
using BOOKINGPARTSDELIVERYVIEW from '../db/calcviews';
using PROGRAMSEARCH from '../db/calcviews';
using MINIPROGRAMCATEGORYCALVIEW from '../db/calcviews';
using MINIPROGRAMDELIVERYLOCATIONCALVIEW from '../db/calcviews';
using MINIPROGRAMDELIVERYMETHODCALVIEW from '../db/calcviews';
using MINIPROGRAMPARTFITMENTCALVIEW from '../db/calcviews';
using MINIPROGRAMPARTSCALVIEW from '../db/calcviews';
using MINIPROGRAMPRIORPURCHASECALVIEW from '../db/calcviews';
using MINIPROGRAMVENDORCALVIEW from '../db/calcviews';


service BookingProgram

@(
    path: '/BookingProgram',
    impl: './programAdmin-service.js'
) {
    entity TireVendorDropDownSet                                                                                                                                 as projection on bookingadmin.programPartView {
        key PROGRAM_UUID,
            *
    };

    entity SeriesYearDropDown                                                                                                                                    as projection on bookingadmin.programPartFitmentView {
        key PROGRAM_UUID,
            *
    };

    entity ProgramValidDeliveryMethodSet                                                                                                                         as projection on bookingadmin.programValidDeliveryMethodsView {
        key PROGRAM_UUID,
        key LANGUAGE_KEY,
        key DEL_METHOD,
            *
    };

    entity ProgramVechicleModelYearLangSet                                                                                                                       as projection on bookingadmin.programVechicleModelYearLangView {
        key PROGRAM_UUID,
        key LANGUAGE_KEY,
        key BRAND,
        key MODEL_CODE,
        key YEAR,
            *
    };

    entity ProgramValidCategoriesLangSet                                                                                                                         as projection on bookingadmin.programValidCategoriesLangView {
        key PROGRAM_UUID,
        key LANGUAGE_KEY,
        key CATEGORY_ID,
            *

    };

    entity ProgramValidVendorsLangSet                                                                                                                            as projection on bookingadmin.programValidVendorsLangView {
        key PROGRAM_UUID,
        key LANGUAGE_KEY,
        key VENDOR_ID,
            *
    };

    entity ValidProgramPartsModelYearsSet                                                                                                                        as projection on bookingadmin.programValidProgramPartsModelYearsView {
        key PROGRAM_UUID,
        key PART_NUM,
        key BRAND,
        key MODEL_CODE,
        key YEAR,
            *
    };

    entity DepartmentSet                                                                                                                                         as projection on bookingadmin.departmentView {
        key CODE,
        key LANG,
            *
    };

    entity Departments                                                                                                                                           as projection on bookingadmin.departmentLangView {
        key CODE,
            *
    };

    entity DeliveryMethods                                                                                                                                       as projection on bookingadmin.deliveryMethodNamesView {
        key DEL_METHOD,
            *
    };

    entity DeliveryMethodNameSet                                                                                                                                 as projection on bookingadmin.deliveryMethodNameView {
        key DEL_METHOD,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramValidDeliveryMethodLangSet                                                                                                                     as projection on bookingadmin.programValidDeliveryMethodLangView {
        OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramDealerDeliveryLocationSet                                                                                                                      as projection on bookingadmin.programDealerDeliveryLocationView {
        key OBJECT_KEY,
            *
    };

    entity ProgramCategoryAll                                                                                                                                    as projection on bookingadmin.programCategoryCountView {
        key PROGRAM_UUID,
            *
    };

    //----------
    // Procedure added (view is used 2 times)
    //DONE
    entity DealerBookingPartPeriodSet @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: false},
        DeleteRestrictions: {Deletable: false}
    })                                                                                                                     as
        projection on booking.dealerBookingPeriodView {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key PART_NUM,
            key VENDOR_ID,
            key MMYYYY,
                *
        } actions {
            //action dealerBookingPeriodCreate(PROGRAM_UUID:String(36),DEALER_CODE : String(20), DEALER_CODE_S : String(6), DEALER_NAME : String, PART_NUM : String(100), VENDOR_ID : String(20), CATEGORY_ID : String(18), MMYYYY : String(6), PERIOD_DT : Date, ORDER_QTY : Integer, CHANGED_BY : String) returns booking.PROCEDURES_TT_ERRORS;
        };
        
        action dealerBookingPeriodCreate( PROGRAM_UUID:String(36),DEALER_CODE : String(20), DEALER_CODE_S : String(6), DEALER_NAME : String, PART_NUM : String(100), VENDOR_ID : String(20), CATEGORY_ID : String(18), MMYYYY : String(6), PERIOD_DT : Date, ORDER_QTY : Integer, CHANGED_BY : String) returns String;

    //Done
    entity DealerBookingPartPeriodVendorSet @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: false},
        DeleteRestrictions: {Deletable: false}
    })                                                                                                                     as
        projection on booking.dealerBookingPeriodView {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key PART_NUM,
            key VENDOR_ID,
            key MMYYYY,
                *
        } actions {
            action dealerBookingPeriodCreate(PROGRAM_UUID : String(36), DEALER_CODE : String, DEALER_CODE_S : String, DEALER_NAME : String, PART_NUM : String, VENDOR_ID : String, CATEGORY_ID : String, MMYYYY : String, PERIOD_DT : String, ORDER_QTY : Integer, CHANGED_BY : String) returns String;
        };

    entity ValidProgramPartsModelYearsVendorSet                                                                                                                  as projection on bookingadmin.programValidProgramPartsModelYearsView {
        key PROGRAM_UUID,
        key PART_NUM,
        key BRAND,
        key MODEL_CODE,
        key YEAR,
            *,
    // to_ProgramPartsModelYearsSet       : Association to DealerBookingPartSet on to_ProgramPartsModelYearsSet.PROGRAM_UUID = PROGRAM_UUID
    //                                      and                                    to_ProgramPartsModelYearsSet.PART_NUM     = PART_NUM,
    // to_ProgramPartsModelYearsVendorSet : Association to DealerBookingPartVendorSet on to_ProgramPartsModelYearsVendorSet.PROGRAM_UUID = PROGRAM_UUID
    //                                      and                                          to_ProgramPartsModelYearsVendorSet.PART_NUM     = PART_NUM
    };

    entity DealerBookingDeliveryPeriodSet @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: false},
        DeleteRestrictions: {Deletable: false}
    })                                                                                                                     as
        projection on booking.dealerDeliveryPeriodView {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key VENDOR_ID,
            key CATEGORY_ID,
            key MMYYYY,
                *
        } actions {
            //action dealerBookingDeliveryPeriodCreate(PROGRAM_UUID : String(36),DEALER_CODE : String(20),VENDOR_ID : String(20),CATEGORY_ID : String(18),MMYYYY : String(6),PERIOD_DT : Date,SCHEDULE_DATE : Date,CHANGED_BY : String, ) returns String;
        };

        action dealerBookingDeliveryPeriodCreate(PROGRAM_UUID : String(36),DEALER_CODE : String(20),VENDOR_ID : String(20),CATEGORY_ID : String(18),MMYYYY : String(6),PERIOD_DT : Date,SCHEDULE_DATE : Date,CHANGED_BY : String, ) returns String;

    //Done
    entity DealerBookingDeliverySet @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: false},
        DeleteRestrictions: {Deletable: false}
    })                                                                                                                     as
        projection on booking.dealerDeliveryView {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key CATEGORY_ID,
            key VENDOR_ID,
                *
        } actions {
           // action dealerBookingDeliveryCreate(PROGRAM_UUID : String(36), DEALER_CODE : String(20), VENDOR_ID : String(20), CATEGORY_ID : String(18), DEL_METHOD : String(20), DEL_LOCATION_UUID : String(36), SPECIAL_INSTRUCTION : String(250), CHANGED_BY : String) returns String;
        };
         action dealerBookingDeliveryCreate(PROGRAM_UUID : String(36), DEALER_CODE : String(20), VENDOR_ID : String(20), CATEGORY_ID : String(18), DEL_METHOD : String(20), DEL_LOCATION_UUID : String(36), SPECIAL_INSTRUCTION : String(250), CHANGED_BY : String) returns String;

    //Done
    entity BookingProgramSummary @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: true},
        DeleteRestrictions: {Deletable: true}
    })                                                                                                                     as
        projection on bookingadmin.bookingProgramView {
            key PROGRAM_UUID,
                *,
                to_programCounts : Association to BookingProgramCount on to_programCounts.PROGRAM_UUID = PROGRAM_UUID,
                to_cpprogram     : Association to BookingProgramCount on to_cpprogram.PROGRAM_UUID = CPROGRAM_UUID
        } actions {
            action bookingProgramCreate(BRAND : String, CHANGED_BY : String, CLOSE_DATE : String, CPROGRAM_UUID : String, DELIVERY_FR : String, DELIVERY_TO : String, DEPART : String, EN_DESC : String, FINAL_WARN : String, FR_DESC : String, INITIAL_WARN : String, OPEN_DATE : String, PROGRAM_ID : String, STATUS : String)                            returns String;
            //action bookingProgramUpdate(PROGRAM_UUID : String(36), BRAND : String, CHANGED_BY : String, CLOSE_DATE : String, CPROGRAM_UUID : String, DELIVERY_FR : String, DELIVERY_TO : String, DEPART : String, EN_DESC : String, FINAL_WARN : String, FR_DESC : String, INITIAL_WARN : String, OPEN_DATE : String, PROGRAM_ID : String, STATUS : String) returns String;
            action bookingProgramDelete(PROGRAM_UUID : String(36))                                                                                                                                                                                                                                                                                          returns String;

        };
        action bookingProgramUpdate(PROGRAM_UUID : String(36), BRAND : String, CHANGED_BY : String, CLOSE_DATE : String, CPROGRAM_UUID : String, DELIVERY_FR : String, DELIVERY_TO : String, DEPART : String, EN_DESC : String, FINAL_WARN : String, FR_DESC : String, INITIAL_WARN : String, OPEN_DATE : String, PROGRAM_ID : String, STATUS : String) returns String;


    entity BookingProgramCount                                                                                                                                   as projection on bookingadmin.programCountView {
        key PROGRAM_UUID,
            *,
            // to_programCounts : Association to BookingProgramSummary on to_programCounts.PROGRAM_UUID = PROGRAM_UUID,
            // to_cpprogram     : Association to BookingProgramSummary on to_cpprogram.CPROGRAM_UUID = PROGRAM_UUID
    };

    //Done
    entity ProgramCategorySet                                                                                              as
        projection on bookingadmin.programCategoryView {
            key OBJECT_KEY,
                *
        } 
        action programCategoryCreate( PROGRAM_UUID : String(36), CATEGORY_ID : String(18), VALID : String(1), EN_DESC : String(100), FR_DESC : String(100), CHANGED_BY : String(36)) returns String;
        action programCategoryUpdate(OBJECT_KEY : String(36), PROGRAM_UUID : String(36), CATEGORY_ID : String(18), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), EN_DESC : String(100), FR_DESC : String(100), CHANGED_BY : String(36), DONOTTRANSPORT : String(1)) returns String;
        action programCategoryDelete(OBJECT_KEY : String(36))                                                                                                                                                                                                                             returns String;



    entity ProgramCategoryLangSet                                                                                                                                as projection on bookingadmin.programCategoryLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramVendorLangSet                                                                                                                                  as projection on bookingadmin.programVendorLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramDeliveryMethodLangSet                                                                                                                          as projection on bookingadmin.programDeliveryMethodLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramDeliveryLocationLangSet                                                                                                                        as projection on bookingadmin.programDeliveryLocationLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramPartLangSet                                                                                                                                    as projection on bookingadmin.programPartLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramPriorPurchaseLangSet                                                                                                                           as projection on bookingadmin.programPriorPurchaseLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ProgramPartFitmentLangSet                                                                                                                             as projection on bookingadmin.programPartFitmentLangView {
        key OBJECT_KEY,
        key LANGUAGE_KEY,
            *
    };

    entity ObjectMessageSet                                                                                                                                      as projection on bookingadmin.objectMessageView {
        key OBJECT_KEY,
        key ERROR_CODE,
        key LANGUAGE_KEY,
            *,
    // to_miniProgramCategoryMessages         : Association to MiniProgramCategorySet on to_miniProgramCategoryMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                      to_miniProgramCategoryMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_miniProgramVendorMessages           : Association to MiniProgramVendorSet on to_miniProgramVendorMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                    to_miniProgramVendorMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_miniProgramDeliveryMethodMessages   : Association to MiniProgramDeliveryMethodSet on to_miniProgramDeliveryMethodMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                            to_miniProgramDeliveryMethodMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_miniProgramDeliveryLocationMessages : Association to MiniProgramDeliveryLocationSet on to_miniProgramDeliveryLocationMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                              to_miniProgramDeliveryLocationMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_miniProgramPartsMessages            : Association to MiniProgramPartsSet on to_miniProgramPartsMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                   to_miniProgramPartsMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_miniProgramPriorPurchaseMessages    : Association to MiniProgramPriorPurchaseSet on to_miniProgramPriorPurchaseMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                           to_miniProgramPriorPurchaseMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_miniProgramPartFitmentMessages      : Association to MiniProgramPartFitmentSet on to_miniProgramPartFitmentMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                         to_miniProgramPartFitmentMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programCategoryMessages             : Association to ProgramCategoryLangSet on to_programCategoryMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                      to_programCategoryMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programVendorMessages               : Association to ProgramVendorLangSet on to_programVendorMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                    to_programVendorMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programDeliveryMethodMessages       : Association to ProgramDeliveryMethodLangSet on to_programDeliveryMethodMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                            to_programDeliveryMethodMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programDeliveryLocationMessages     : Association to ProgramDeliveryLocationLangSet on to_programDeliveryLocationMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                              to_programDeliveryLocationMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programPartMessages                 : Association to ProgramPartLangSet on to_programPartMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                  to_programPartMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programPriorPurchaseMessages        : Association to ProgramPriorPurchaseLangSet on to_programPriorPurchaseMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                           to_programPriorPurchaseMessages.LANGUAGE_KEY = LANGUAGE_KEY,
    // to_programPartFitmentMessages          : Association to ProgramPartFitmentLangSet on to_programPartFitmentMessages.OBJECT_KEY   = OBJECT_KEY
    //                                          and                                         to_programPartFitmentMessages.LANGUAGE_KEY = LANGUAGE_KEY

    };

    //Create Done
    entity ProgramVendorSet                                                                                      as
        projection on bookingadmin.programVendorView {
            key OBJECT_KEY,
                *
        } actions {
            action programVendorCreate(PROGRAM_UUID : String(36), VENDOR_ID : String(20), DISTRIBUTOR : String(1), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), EN_DESC : String(100), FR_DESC : String(100), CHANGED_BY : String(36)) returns String;
        // action programVendorUpdate(OBJECT_KEY : String(36), PROGRAM_UUID : String(36), VENDOR_ID : String(20), DISTRIBUTOR : String(1), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), EN_DESC : String(100), FR_DESC : String(100), CHANGED_BY : String(36)) returns String;
        //action programVendorDelete(OBJECT_KEY : String(36))                                                                                                                                                                                                                        returns String;

        };

    action   programVendorUpdate(OBJECT_KEY : String(36), PROGRAM_UUID : String(36), VENDOR_ID : String(20), DISTRIBUTOR : String(1), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), EN_DESC : String(100), FR_DESC : String(100), CHANGED_BY : String(36))                                                                                                                                                                                                                                                                                         returns String;
    action   programVendorDelete(OBJECT_KEY : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  returns String;


    //Create Done
    entity ProgramDeliveryLocationSet                                                                                      as
        projection on bookingadmin.programDeliveryLocationView {
            key OBJECT_KEY,
                *
        } actions {
            action programDeliveryLocationCreate(PROGRAM_UUID : String(36), VENDOR_ID : String(20), DEL_LOCATION_ID : String(10), LANG : String(2), DEL_LOCATION_NAME : String(100), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), VENDOR_TYPE : String(2), EN_DEL_LOCATION_NAME : String(100), FR_DEL_LOCATION_NAME : String(100), DEL_ADDRESS1 : String(50), DEL_ADDRESS2 : String(50), DEL_CITY : String(50), DEL_PROVINCE : String(2), DEL_POSTAL_CODE : String(6), DEL_PHONE_NUMBER : String(10), CHANGED_BY : String(36)) returns String;
            // action programDeliveryLocationUpdate(OBJECT_KEY : String(36), PROGRAM_UUID : String(36), VENDOR_ID : String(20), DEL_LOCATION_ID : String(10), LANG : String(2), DEL_LOCATION_NAME : String(100), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), VENDOR_TYPE : String(2), EN_DEL_LOCATION_NAME : String(100), FR_DEL_LOCATION_NAME : String(100), DEL_ADDRESS1 : String(50), DEL_ADDRESS2 : String(50), DEL_CITY : String(50), DEL_PROVINCE : String(2), DEL_POSTAL_CODE : String(6), DEL_PHONE_NUMBER : String(10), CHANGED_BY : String(36)) returns String;
            // action programDeliveryLocationDelete(PROGRAM_UUID : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      returns String;
        };
        action programDeliveryLocationUpdate(OBJECT_KEY : String(36), PROGRAM_UUID : String(36), VENDOR_ID : String(20), DEL_LOCATION_ID : String(10), LANG : String(2), DEL_LOCATION_NAME : String(100), VALID : String(1), BATCH_MODE : String(1), ERROR_CODES : String(100), VENDOR_TYPE : String(2), EN_DEL_LOCATION_NAME : String(100), FR_DEL_LOCATION_NAME : String(100), DEL_ADDRESS1 : String(50), DEL_ADDRESS2 : String(50), DEL_CITY : String(50), DEL_PROVINCE : String(2), DEL_POSTAL_CODE : String(6), DEL_PHONE_NUMBER : String(10), CHANGED_BY : String(36)) returns String;
        action programDeliveryLocationDelete(OBJECT_KEY : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      returns String;


    //Create Done
    entity ProgramPartSet                                                                                                  as
        projection on bookingadmin.programPartView {
            key OBJECT_KEY,
                *
        } actions {
            action programPartCreate(PROGRAM_UUID : String(36),
                                     VENDOR_ID : String(20),
                                     CATEGORY_ID : String(18),
                                     PART_NUM : String(40),
                                     DETAIL : String,
                                     TIRESIZE : String(40),
                                     SPEEDRATING : String(1),
                                     LOADRATING : String(3),
                                     DEALERNET : String(40),
                                     VALID : String(1),
                                     BATCH_MODE : String(1),
                                     ERROR_CODES : String(100),
                                     EN_DESC : String(100),
                                     FR_DESC : String(100),
                                     EN_VENDOR_DESC : String(100),
                                     FR_VENDOR_DESC : String(100),
                                     EN_CATEGORY_DESC : String(100),
                                     FR_CATEGORY_DESC : String(100),
                                     CHANGED_BY : String(36),
                                     DONOTTRANSPORT : String(1))  returns String;

            // action programPartDelete(OBJECT_KEY : String(36)) returns String;

        };
        action programPartDelete(OBJECT_KEY : String(36)) returns String;

    //Create Done
    entity ProgramPartFitmentSet                                                                                                                                 as projection on bookingadmin.programPartFitmentView {
        key OBJECT_KEY,
            *
    } actions {
        action programPartFitmentCreate(
            PROGRAM_UUID: String(36),
            PART_NUM: String(40),
            MODEL_CODE: String(7),
            SERIES_CODE: String(3),
            YEAR: String(4),
            VALID: String(1),
            BATCH_MODE: String(1),
            ERROR_CODES: String(100),
            EN_PART_DESC: String(100),
            FR_PART_DESC: String(100),
            EN_MODEL_DESC: String(100),
            FR_MODEL_DESC: String(100),
            BRAND: String(2),
            BRAND_NAME: String(10),
            CHANGED_BY: String(36),
            EN_SERIES_DESC: String(36),
            FR_SERIES_DESC: String(36)) returns String;

        // action programPartFitmentDelete(OBJECT_KEY : String(36)) returns String;

    };
    action programPartFitmentDelete(OBJECT_KEY : String(36)) returns String;

    entity ProgramPriorPurchaseSet                                                                                         as
        projection on bookingadmin.programPriorPurchaseMiniView {
            key OBJECT_KEY,
                *
        } actions {
            action programPriorPurchaseMiniCreate(PROGRAM_UUID : String(36),BRAND:String(2),DEALER_CODE : String(20),DEALER_CODE_S : String(6),PART_NUM : String(40),PRIOR_PURCHASES : Integer,VALID : String(1),BATCH_MODE : String(1),ERROR_CODES : String(100),EN_PART_DESC : String(100),FR_PART_DESC : String(100),EN_DEALER_DESC : String(100),FR_DEALER_DESC : String(100),CHANGED_BY : String(36))              returns String;
            //action programPriorPurchaseMiniDelete(PROGRAM_UUID : String(36)) returns String;
        };
        action programPriorPurchaseMiniDelete(OBJECT_KEY : String(36)) returns String;


    entity ProgramCategoryDeleteAll                                                                                        as
        projection on bookingadmin.programCategoryDeleteAllView {
            key PROGRAM_UUID,
                *
        } actions {
            action programCategoryDeleteBatch(PROGRAM_UUID : String(36)) returns String;
        };

    entity ProgramVendorAll                                                                                                                                      as projection on bookingadmin.programVendorCountView {
        key PROGRAM_UUID,
            *
    } actions {
        action programVendorDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    entity ProgramDeliveryLocationAll                                                                                                                            as projection on bookingadmin.programDelLocationCountView {
        key PROGRAM_UUID,
            *
    } actions {
        action programDeliveryLocationDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    entity ProgramVendorDeliveryLocationAll                                                                                                                      as projection on bookingadmin.programVendorDelLocationCountView {
        key PROGRAM_UUID,
        key VENDOR_ID,
            *
    } actions {
        action programVendorDeliveryLocationDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    entity ProgramDeliveryMethodAll                                                                                                                              as projection on bookingadmin.programDelMethodCountView {
        key PROGRAM_UUID,
            *
    } actions {
        action programDeliveryMethodDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    entity ProgramPartAll                                                                                                                                        as projection on bookingadmin.programPartsCountView {
        key PROGRAM_UUID,
            *
    } actions {
        action programPartDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    entity ProgramPriorPurchaseAll                                                                                                                               as projection on bookingadmin.programPriorPurchasesCountView {
        key PROGRAM_UUID,
            *
    } actions {
        action programPriorPurchaseMiniDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    entity ProgramPartFitmentAll                                                                                                                                 as projection on bookingadmin.programPartFitmentCountView {
        key PROGRAM_UUID,
            *
    } actions {
        action programPartDeleteBatch(PROGRAM_UUID : String(36)) returns String;
    };

    //Create Done
    entity ProgramDeliveryMethodSet                                                                                                                              as projection on bookingadmin.programDeliveryMethodView {
        key OBJECT_KEY,
            *
    } actions {
        action programDeliveryMethodCreate(
            PROGRAM_UUID     : String(36),
            VENDOR_ID        : String(20),
            CATEGORY_ID      : String(18),
            DEL_METHOD       : String(20),
            VALID            : String(1),
            BATCH_MODE       : String(1),
            ERROR_CODES      : String(100),
            EN_DEL_M_NAME    : String(100),
            FR_DEL_M_NAME    : String(100),
            EN_VENDOR_DESC   : String(100),
            FR_VENDOR_DESC   : String(100),
            EN_CATEGORY_DESC : String(100),
            FR_CATEGORY_DESC : String(100),
            CHANGED_BY       : String(36),
            DONOTTRANSPORT   : String(1)) returns String;
        // action programDeliveryMethodDelete(PROGRAM_UUID : String(36)) returns String;
    };
    action programDeliveryMethodDelete(OBJECT_KEY : String(36)) returns String;
    //calc views
    //entity parameters
    entity DealerBookingVendorReportSet(PROGRAMUID : String(36), VENDORCODE : String(20), LANGUAGE : String(2))                                                  as
        select from DEALERBOOKINGVENDORREPORTCALCULATION (
            PROGRAMUID::PROGRAMUID, VENDORCODE::VENDORCODE, LANGUAGE::LANGUAGE
        ){
            key '' as ID : String,
                *
        };

    entity DealerBookingReportSet(PROGRAMUID : String(36), LANGUAGE : String(2))                                                                                 as
        select from DEALERBOOKINGREPORTCALCULATION (
            PROGRAMUID::PROGRAMUID, LANGUAGE::LANGUAGE
        ) {
            //key '' as ID : String,
                *
        };

    entity ProgramPeriodsMetaSet(IN_PROGRAM_UUID : String(36))                                                                                                   as
        select from PROGRAMPERIODSMETA (
            IN_PROGRAM_UUID::IN_PROGRAM_UUID
        ) {
            *
        };

    entity DealerBookingStatusSummarySet(InDealerCode : String(20), ProgramUUID : String(36), Lang : String(2))                                         as
        select from DEALERBOOKINGSTATUSSUMMARYVIEW (
            IN_DEALER_CODE::InDealerCode, IN_PROGRAM_UUID::ProgramUUID, IN_LANG::Lang
        ) {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key LANGUAGE_KEY,
                *
            
        };

    // entity DealerBookingStatusSummarySet(IN_LANG : String(2))                                         as
    //     select from DEALERBOOKINGSTATUSSUMMARYVIEW (
    //         IN_LANG::IN_LANG
    //     ) {
    //         key PROGRAM_UUID,
    //         key DEALER_CODE,
    //         key LANGUAGE_KEY,
    //             *
    //     };

    //Procedure added done
    entity DealerBookingStatusSet @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: false},
        DeleteRestrictions: {Deletable: false}
    })                                                                                                                     as
        projection on DEALERBOOKINGSTATUS {
            key PROGRAM_UUID,
            key DEALER_CODE,
                *
        } actions {
            //action bookingProgramStatusCreate(PROGRAM_UUID : String(36), DEALER_CODE : String(20), DEALER_CODE_S : String(6), B_STATUS : String(2), CREATED_BY : String(36)) returns String;
        };
        
        action bookingProgramStatusCreate(PROGRAM_UUID : String(36), DEALER_CODE : String(20), DEALER_CODE_S : String(6), B_STATUS : String(2), CREATED_BY : String(36)) returns String;

    entity DealerBookingCategoryDeliverySet(DealerCode : String(20), ProgramUUID : String(36), Lang : String(2), ) as
        select from DEALERBOOKINGCATEGORYDELIVERYVIEW (
            DEALERCODE::DealerCode, LANG::Lang, PROGRAMUUID::ProgramUUID
        ) {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key CATEGORY_ID,
            key VENDOR_ID,
                *,
                //to_DeliveryMethodSet: Association to 
                // to_DealerBookingCategoryDeliverySchedule : Association to DealerBookingCategoryDeliveryScheduleSet on to_DealerBookingCategoryDeliverySchedule.PROGRAM_UUID = PROGRAM_UUID
                //                                            and                                                        to_DealerBookingCategoryDeliverySchedule.DEALER_CODE  = DEALER_CODE
                //                                            and                                                        to_DealerBookingCategoryDeliverySchedule.CATEGORY_ID  = CATEGORY_ID
                //                                            and                                                        to_DealerBookingCategoryDeliverySchedule.VENDOR_ID    = VENDOR_ID
        };
//Trying mixin

// entity DealerBookingCategoryDeliverySet1(DealerCode : String(20), ProgramUUID : String(36), Lang : String(2), ) as
//         select from DEALERBOOKINGCATEGORYDELIVERYVIEW (
//             DEALERCODE::DealerCode, LANG::Lang, PROGRAMUUID::ProgramUUID
//         )
//         mixin {
//             // key PROGRAM_UUID,
//             // key DEALER_CODE,
//             // key CATEGORY_ID,
//             // key VENDOR_ID
//             items : Association to many DealerBookingCategoryDeliveryScheduleSet
//                         on items.PROGRAM_UUID = PROGRAM_UUID;

//         }
//         into {
//             *,
//             items
//         };


    entity DealerBookingCategoryDeliveryScheduleSet @(Capabilities: {
        InsertRestrictions: {Insertable: true},
        UpdateRestrictions: {Updatable: true},
        DeleteRestrictions: {Deletable: true}
    }, )                                                                                                           as
        projection on DEALERBOOKINGCATEGORYDELIVERYSCHEDULEVIEW {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key CATEGORY_ID,
            key VENDOR_ID,
            key MMYYYY,
                *,
            // to_DealerBookingCategoryDeliverySchedule : Association to DealerBookingCategoryDeliveryScheduleSet on to_DealerBookingCategoryDeliverySchedule.PROGRAM_UUID = PROGRAM_UUID
            //                                                and                                                        to_DealerBookingCategoryDeliverySchedule.DEALER_CODE  = DEALER_CODE
            //                                                and                                                        to_DealerBookingCategoryDeliverySchedule.CATEGORY_ID  = CATEGORY_ID
            //                                                and                                                        to_DealerBookingCategoryDeliverySchedule.VENDOR_ID    = VENDOR_ID
        //to_DealerDeliveryLocation: Association to DealerBookingStatusSummarySet on to_DealerDeliveryLocation.PROGRAM_UUID=PROGRAM_UUID
        };
//Entities with parameters
    entity DealerBookingPartSet(InDealerCode : String(20), Lang : String(2), ProgramUUID : String(36))                                                  as
        select from DEALERBOOKINGPARTPERIODVIEW (
            INDEALERCODE::InDealerCode, LANG::Lang, PROGRAMUUID::ProgramUUID
        ) {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key PART_NUM,
            key VENDOR_ID,
                *
        };

    entity DealerBookingPartVendorSet(InDealerCode : String(20), Lang : String(2), ProgramUUID : String(36))                                              as
        select from DEALERBOOKINGPARTVENDORPERIODVIEW (
            INDEALERCODE::InDealerCode, LANG::Lang, PROGRAMUUID::ProgramUUID
        ) {
            key PROGRAM_UUID,
            key DEALER_CODE,
            key PART_NUM,
            key VENDOR_ID,
                *
        };

    entity PartBookingOrderDeliverySet(ProgramUUID : String(36))                                                                                                as
        select from BOOKINGPARTSDELIVERYVIEW (
            PROGRAMUUID::ProgramUUID
        ) {
            //key '' as localID : String,
                *
        };
   
    entity ProgramSearchSet(IN_LANG : String(2))                                                                           as
        select from PROGRAMSEARCH (
            IN_LANG::IN_LANG
        ) {
            key PROGRAM_UUID,
                *
        };

        entity ProgramSearchSetP(IN_LANG : String(2),IN_STATUS:String(2),IN_BRAND:String(2),IN_PNUM:String(36))                                                                           as
        select from PROGRAMSEARCH (
            IN_LANG::IN_LANG,IN_STATUS::IN_STATUS,IN_BRAND::IN_BRAND,IN_PNUM::IN_PNUM
        ) {
            key PROGRAM_UUID,
                *
        };

        entity ProgramSearchSetS(IN_LANG : String(2),IN_STATUS:String(2),IN_BRAND:String(2))                                                                         as
        select from PROGRAMSEARCH (
            IN_LANG::IN_LANG,IN_STATUS::IN_STATUS,IN_BRAND::IN_BRAND
        ) {
            key PROGRAM_UUID,
                *
        };


    entity MiniProgramCategorySet(ProgramUid : String(36), Language : String(2))                                 as
        select from MINIPROGRAMCATEGORYCALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *,
                //to_messages : Association to MiniProgramCategorySet on to_messages.OBJECT_KEY   = OBJECT_KEY
                  //            and                                      to_messages.LANGUAGE_KEY = LANGUAGE_KEY,
        };

    entity MiniProgramDeliveryLocationSet(ProgramUid : String(36), Language : String(2))                                                                         as
        select from MINIPROGRAMDELIVERYLOCATIONCALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *
        };

    entity MiniProgramDeliveryMethodSet(ProgramUid : String(36), Language : String(2))                                                                           as
        select from MINIPROGRAMDELIVERYMETHODCALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *
        };

    entity MiniProgramPartFitmentSet(ProgramUid : String(36), Language : String(2))                                                                              as
        select from MINIPROGRAMPARTFITMENTCALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *
        };

    entity MiniProgramPartsSet(ProgramUid : String(36), Language : String(2))                                                                                    as
        select from MINIPROGRAMPARTSCALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *
        };

    entity MiniProgramPriorPurchaseSet(ProgramUid : String(36), Language : String(2))                                                                            as
        select from MINIPROGRAMPRIORPURCHASECALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *
        };

    entity MiniProgramVendorSet(ProgramUid : String(36), Language : String(2))                                                                                   as
        select from MINIPROGRAMVENDORCALVIEW (
            PROGRAMUID::ProgramUid, LANGUAGE::Language
        ) {
            key OBJECT_KEY,
                *
        };

//
    entity ERROR_CODE                                                                                                                                            as projection on core.ERROR_CODE;
    //XSJS Functions
    type DealerBookingReport{
        PROGRAM_UUID        : String(36);
        PROGRAM_ID          : String(40);
        STATUS              : String(10);
        VENDOR_ID           : String(20);
        VENDOR_DESC         : String(100);
        DEALER_CODE         : String(20);
        DEALER_NAME         : String(100);
        DEALER_CODE_S       : String(6);
        CATEGORY_ID         : String(18);
        CATEGORY_DESC       : String(100);
        PART_NUM            : String(40);
        PART_DESC           : String(100);
        DETAIL              : String(255);
        MMYYYY              : String(6);
        ORDER_QTY           : Decimal(13);
        SCHEDULE_DATE       : Date;
        DEL_METHOD          : String(20);
        DEL_METHOD_NAME     : String(100);
        SPECIAL_INSTRUCTION : String(250);
        DEL_LOCATION_ID     : String(10);
        DEL_LOCATION_NAME   : String(100);
        DEL_ADDRESS1        : String(50);
        DEL_ADDRESS2        : String(50);
        DEL_CITY            : String(50);
        DEL_PROVINCE        : String(2);
        DEL_POSTAL_CODE     : String(6);
        DEL_PHONE_NUMBER    : String(10);
        B_STATUS            : String(2);
        TIRESIZE            : String(40);
    }

    function allDealerBookingReport(programUUID : String(36))  returns array of DealerBookingReport;
    action   categoryDeleteAll(programUuid : String(36)) returns Integer;
    action   categoryUploader(inData : String)   returns String;
    function dealerBooked(programUUID : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        returns String;
    action   deliveryLocationDeleteAll(programUuid : String(36)) returns Integer;
    action   deliveryLocationUploader(inData : String)                                                                                                                                                                                                                                                                   returns String;
    action   deliveryMethodDeleteAll(programUuid : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         returns Integer;
    action   deliveryMethodUploader(inData : String)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       returns String;
    function index()                                                                                                                                                                                                                                                                                                                                                                                                                 returns array of ERROR_CODE;
    action   partFitmentDeleteAll(programUuid : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            returns Integer;
    action   partFitmentUploader(inData : String)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          returns String;
    action   partsDeleteAll(programUuid : String(36))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  returns Integer;
    action   partsUploader(inData : String)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                returns String;
    action   priorPurchaseDeleteAll(programUuid : String(36))  returns Integer;
    action   priorPurchaseUploader(inData : String)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        returns String;

    type returnObject {
        SERIES_CODE    : String(3);
        EN_SERIES_DESC : String(100);
        FR_SERIES_DESC : String(100);
        YEAR           : String(4)
    }

    function seriesYear(programUUID : String(36))                      returns array of returnObject;
    function seriesYearBrand(programUUID : String(36), division : String) returns array of returnObject;
    type returnObj{
        TIRESIZE : String(40);
    }
    function tiresizeInput(programUUID : String(36))                   returns array of returnObj;
    action   vendorDeleteAll(programUuid : String(36))              returns Integer;
    action   vendorUploader(inData:String)               returns String;
    type returnObjs{
        CATEGORY_ID : String(18);
    }
    function validCategories(programUuid : String(36))                  returns array of returnObjs;

    action readEntities(inData : String, dealerCode:String) returns String;

}




