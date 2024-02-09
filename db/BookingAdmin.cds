using Core from './Core'; // replaced "EM" with "Core"
//using {temporal} from '@sap/cds/common';

context ProgramAdmin {
    define view programVechicleModelYearsView as
        select from PROG_PART_FITMENT {
            key PROGRAM_UUID as PROGRAM_UUID,
            key MODEL_CODE   as MODEL_CODE,
            key YEAR         as YEAR
        }
        where
            VALID = 'X'
        group by
            ![PROGRAM_UUID],
            ![MODEL_CODE],
            ![YEAR];

    define view programValidProgramPartsModelYearsView as
        select from (
            PROG_PART_FITMENT as A
            left outer join VEHICLE_MODEL as B
                on A.MODEL_CODE = B.MODEL_CODE
        ) {
            key A.PROGRAM_UUID as PROGRAM_UUID,
            key A.PART_NUM     as PART_NUM,
            key B.BRAND        as BRAND,
            key A.MODEL_CODE   as MODEL_CODE,
            key A.YEAR         as YEAR,
                count( * )     as COUNT : Integer
        }
        where
            A.VALID = 'X'
        group by
            A.PROGRAM_UUID,
            A.PART_NUM,
            B.BRAND,
            A.MODEL_CODE,
            A.YEAR;

    define view programValidDeliveryMethodsView as
            select from DEL_METH_NAME {
                key '!!!--!!!'      as ![PROGRAM_UUID] : String,
                key DEL_METHOD      as ![DEL_METHOD],
                key LANGUAGE_KEY    as ![LANGUAGE_KEY],
                    DEL_METHOD_NAME as ![DEL_METHOD_NAME]
            }
        union
            select from (
                ProgramAdmin.PROG_VENDOR as A
                left outer join ProgramAdmin.VENDOR_NAME as B
                    on A.VENDOR_ID = B.VENDOR_ID
            ) {
                A.PROGRAM_UUID as PROGRAM_UUID,
                A.VENDOR_ID    as ![DEL_METHOD],
                B.LANGUAGE_KEY as LANGUAGE_KEY,
                B.VENDOR_DESC  as ![DEL_METHOD_NAME]
            }
            where
                A.VALID = 'X';

    define view programVechicleModelYearLangView as
        select from (
            programVechicleModelYearsView as A
            left outer join VEHICLE_MODEL as B
                on A.MODEL_CODE = B.MODEL_CODE
            left outer join MODEL_NAME as C
                on A.MODEL_CODE = C.MODEL_CODE
            left outer join TCISeries as D
                on C.SERIES_CODE = D.SERIES_CODE
        ) {
            key A.PROGRAM_UUID as PROGRAM_UUID,
            key A.MODEL_CODE   as MODEL_CODE,
            key C.LANGUAGE_KEY as LANGUAGE_KEY,
            key A.YEAR         as YEAR,
                C.MODEL_DESC   as MODEL_DESC,
                C.SERIES_CODE  as SERIES_CODE,
                D.SERIES_DESC  as SERIES_DESC,
                B.BRAND_NAME   as BRAND_NAME,
                B.BRAND        as BRAND
        }
        order by
            BRAND                 asc,
            upper(![SERIES_DESC]) asc,
            upper(![MODEL_DESC])  asc,
            ![YEAR]               asc;

    define view programValidCategoriesView as
        select from PROG_CATEGORY {
            key PROGRAM_UUID as PROGRAM_UUID,
            key CATEGORY_ID  as CATEGORY_ID
        }
        where
            VALID = 'X'
        group by
            ![PROGRAM_UUID],
            ![CATEGORY_ID];

    define view programValidCategoriesLangView as
        select from (
            programValidCategoriesView as A
            left outer join CATEGORY_NAME as B
                on A.CATEGORY_ID = B.CATEGORY_ID
        ) {
            key A.PROGRAM_UUID   as PROGRAM_UUID,
            key A.CATEGORY_ID    as CATEGORY_ID,
            key B.LANGUAGE_KEY   as LANGUAGE_KEY,
                B.CATEGORY_DESC  as CATEGORY_DESC,
                B.DONOTTRANSPORT as DONOTTRANSPORT
        }
        order by
            upper(![CATEGORY_DESC]) asc;

    /*
         define view programValidVendorsView as
           select from PROG_VENDOR
           {
               key PROGRAM_UUID     as PROGRAM_UUID,
               key	VENDOR_ID		 as VENDOR_ID
           } where VALID = 'X' AND ( DISTRIBUTOR <> 'X' OR DISTRIBUTOR IS NULL )
           group by ![PROGRAM_UUID],![VENDOR_ID];
        */

    define view programValidVendorsView as
        select from PROG_VENDOR {
            key PROGRAM_UUID as PROGRAM_UUID,
            key VENDOR_ID    as VENDOR_ID
        }
        where
            VALID = 'X'
        group by
            ![PROGRAM_UUID],
            ![VENDOR_ID];

    define view programValidVendorsLangView as
        select from (
            programValidVendorsView as A
            left outer join VENDOR_NAME as B
                on A.VENDOR_ID = B.VENDOR_ID
        ) {
            key A.PROGRAM_UUID as PROGRAM_UUID,
            key A.VENDOR_ID    as VENDOR_ID,
            key B.LANGUAGE_KEY as LANGUAGE_KEY,
                B.VENDOR_DESC  as VENDOR_DESC
        }
        order by
            upper(![VENDOR_DESC]) asc;

    define view departmentView as
        select from Core.DEPART_NAME {
            key DEPART_CODE  as CODE,
            key LANGUAGE_KEY as LANG,
                DEPART_NAME  as NAME,
                DEPART_CODE_EXT
        };

    define view departmentCodeView as
        select from Core.DEPART_NAME {
            key DEPART_CODE as DEPART_CODE
        }
        group by
            DEPART_CODE;

    define view departmentLangView as
        select from (
            departmentCodeView as A
            left outer join Core.DEPART_NAME as B
                on  A.DEPART_CODE = B.DEPART_CODE
                and 'EN'          = B.LANGUAGE_KEY
            left outer join Core.DEPART_NAME as C
                on  A.DEPART_CODE = C.DEPART_CODE
                and 'FR'          = C.LANGUAGE_KEY
        ) {
            key A.DEPART_CODE     as CODE,
                B.DEPART_NAME     as EN_NAME,
                C.DEPART_NAME     as FR_NAME,
                B.DEPART_CODE_EXT as CODE_EXT
        };

    define view programCategoryCountView as
        select from PROG_CATEGORY as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                count( * )     as ![count] : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programCategoryDeleteAllView as
        select from PROG_CATEGORY as A {
            key 'A123456789012345678901234567890B' as ![PROGRAM_UUID] : String(36)
        };

    define view programVendorCountView as
        select from PROG_VENDOR as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID] : String(36),
                count( * )     as ![count]        : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programDelMethodCountView as
        select from PROG_DEL_METHOD as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                count( * )     as ![count] : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programDelLocationCountView as
        select from PROG_DEL_LOCATION as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                count( * )     as ![count] : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programVendorDelLocationCountView as
        select from PROG_DEL_LOCATION {
            key PROGRAM_UUID as ![PROGRAM_UUID],
            key VENDOR_ID    as ![VENDOR_ID],
                count( * )   as ![count] : Integer
        }
        group by
            ![PROGRAM_UUID],
            ![VENDOR_ID];

    define view programPartsCountView as
        select from PROG_PARTS as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                count( * )     as ![count] : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programPartFitmentCountView as
        select from PROG_PART_FITMENT as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                count( * )     as ![count] : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programPriorPurchasesCountView as
        select from PROG_PRIOR_PURCHASES as A {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                count( * )     as ![count] : Integer
        }
        group by
            A.PROGRAM_UUID;

    define view programCountView as
        select from (
            BOOKING_PROGRAM as A
            left outer join programCategoryCountView as B
                on A.PROGRAM_UUID = B.PROGRAM_UUID
            left outer join programVendorCountView as C
                on A.PROGRAM_UUID = C.PROGRAM_UUID
            left outer join programDelMethodCountView as D
                on A.PROGRAM_UUID = D.PROGRAM_UUID
            left outer join programDelLocationCountView as E
                on A.PROGRAM_UUID = E.PROGRAM_UUID
            left outer join programPartsCountView as F
                on A.PROGRAM_UUID = F.PROGRAM_UUID
            left outer join programPartFitmentCountView as G
                on A.PROGRAM_UUID = G.PROGRAM_UUID
            left outer join programPriorPurchasesCountView as H
                on A.PROGRAM_UUID = H.PROGRAM_UUID
        ) {
            key A.PROGRAM_UUID as ![PROGRAM_UUID]       : String,
                ifnull(
                    B.count, 0
                )              as ![count_category]     : Integer,
                ifnull(
                    C.count, 0
                )              as ![count_vendor]       : Integer,
                ifnull(
                    D.count, 0
                )              as ![count_del_method]   : Integer,
                ifnull(
                    E.count, 0
                )              as ![count_del_location] : Integer,
                ifnull(
                    F.count, 0
                )              as ![count_part]         : Integer,
                ifnull(
                    G.count, 0
                )              as ![count_part_fitment] : Integer,
                ifnull(
                    H.count, 0
                )              as ![count_p_purchase]   : Integer
        };

    define view programValidCountView as
        select from (
            BOOKING_PROGRAM as A
            left outer join programCategoryCountView as B
                on A.PROGRAM_UUID = B.PROGRAM_UUID
            left outer join programVendorCountView as C
                on A.PROGRAM_UUID = C.PROGRAM_UUID
            left outer join programDelMethodCountView as D
                on A.PROGRAM_UUID = D.PROGRAM_UUID
            left outer join programDelLocationCountView as E
                on A.PROGRAM_UUID = E.PROGRAM_UUID
            left outer join programPartsCountView as F
                on A.PROGRAM_UUID = F.PROGRAM_UUID
            left outer join programPartFitmentCountView as G
                on A.PROGRAM_UUID = G.PROGRAM_UUID
            left outer join programPriorPurchasesCountView as H
                on A.PROGRAM_UUID = H.PROGRAM_UUID
        ) {
            key A.PROGRAM_UUID as ![PROGRAM_UUID],
                ifnull(
                    B.count, 0
                )              as ![count_category]     : String,
                ifnull(
                    C.count, 0
                )              as ![count_vendor]       : String,
                ifnull(
                    D.count, 0
                )              as ![count_del_method]   : String,
                ifnull(
                    E.count, 0
                )              as ![count_del_location] : String,
                ifnull(
                    F.count, 0
                )              as ![count_part]         : String,
                ifnull(
                    G.count, 0
                )              as ![count_part_fitment] : String,
                ifnull(
                    H.count, 0
                )              as ![count_p_purchase]   : String
        };

    define view bookingProgramView as
        select from (
            BOOKING_PROGRAM as A
            left outer join PROG_NAME as B
                on  A.PROGRAM_UUID = B.PROGRAM_UUID
                and 'EN'           = B.LANGUAGE_KEY
            left outer join PROG_NAME as C
                on  A.PROGRAM_UUID = C.PROGRAM_UUID
                and 'FR'           = C.LANGUAGE_KEY
        ) {
            key A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.PROGRAM_ID       as ![PROGRAM_ID],
                A.DEPART           as ![DEPART],
                A.BRAND            as ![BRAND],
                A.OPEN_DATE        as ![OPEN_DATE],
                A.CLOSE_DATE       as ![CLOSE_DATE],
                A.INITIAL_WARN     as ![INITIAL_WARN],
                A.FINAL_WARN       as ![FINAL_WARN],
                A.DELIVERY_FR      as ![DELIVERY_FR],
                A.DELIVERY_TO      as ![DELIVERY_TO],
                A.CPROGRAM_UUID    as ![CPROGRAM_UUID],
                A.STATUS           as ![STATUS],
                B.PROGRAM_DESC     as ![EN_DESC],
                C.PROGRAM_DESC     as ![FR_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    define view bookingProgramLangView as
        select from (
            BOOKING_PROGRAM as A
            left outer join PROG_NAME as B
                on A.PROGRAM_UUID = B.PROGRAM_UUID
        ) {
            key A.PROGRAM_UUID     as ![PROGRAM_UUID],
                B.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_ID       as ![PROGRAM_ID],
                A.DEPART           as ![DEPART],
                A.BRAND            as ![BRAND],
                A.OPEN_DATE        as ![OPEN_DATE],
                A.CLOSE_DATE       as ![CLOSE_DATE],
                A.INITIAL_WARN     as ![INITIAL_WARN],
                A.FINAL_WARN       as ![FINAL_WARN],
                A.DELIVERY_FR      as ![DELIVERY_FR],
                A.DELIVERY_TO      as ![DELIVERY_TO],
                A.CPROGRAM_UUID    as ![CPROGRAM_UUID],
                A.STATUS           as ![STATUS],
                B.PROGRAM_DESC     as ![PROGRAM_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    define view objectMessageView as
        select from (
            Core.OBJECT_MESSAGE as A
            left outer join Core.ERROR_CODE as B
                on A.ERROR_CODE = B.ERROR_CODE
        ) {
            key A.OBJECT_KEY       as OBJECT_KEY,
            key A.ERROR_CODE       as ERROR_CODE,
            key B.LANGUAGE_KEY     as LANGUAGE_KEY,
                B.ERROR_TYPE       as ERROR_TYPE,
                B.ERROR_DESC       as ERROR_DESC,
                A.AUDIT.CHANGED_ON as CHANGED_ON,
                A.AUDIT.CHANGED_BY as CHANGED_BY
        };

    define view programCategoryLangView as
        select from (
            PROG_CATEGORY as A
            left outer join CATEGORY_NAME as B
                on A.CATEGORY_ID = B.CATEGORY_ID
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key B.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                A.VALID            as ![VALID],
                B.CATEGORY_DESC    as ![CATEGORY_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY],
                B.DONOTTRANSPORT   as DONOTTRANSPORT
        };

    define view programCategoryView as
        select from (
            PROG_CATEGORY as A
            left outer join CATEGORY_NAME as B
                on  A.CATEGORY_ID = B.CATEGORY_ID
                and 'EN'          = B.LANGUAGE_KEY
            left outer join CATEGORY_NAME as C
                on  A.CATEGORY_ID = C.CATEGORY_ID
                and 'FR'          = C.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                A.VALID            as ![VALID],
                'X'                as ![BATCH_MODE] : String,
                B.CATEGORY_DESC    as ![ERROR_CODES],
                B.CATEGORY_DESC    as ![EN_DESC],
                C.CATEGORY_DESC    as ![FR_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY],
                B.DONOTTRANSPORT   as DONOTTRANSPORT
        };

    define view programVendorLangView as
        select from (
            PROG_VENDOR as A
            left outer join VENDOR_NAME as B
                on A.VENDOR_ID = B.VENDOR_ID
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key B.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.VENDOR_ID        as ![VENDOR_ID],
                A.DISTRIBUTOR      as ![DISTRIBUTOR],
                A.VALID            as ![VALID],
                B.VENDOR_DESC      as ![VENDOR_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    define view programVendorView as
        select from (
            PROG_VENDOR as A
            left outer join VENDOR_NAME as B
                on  A.VENDOR_ID = B.VENDOR_ID
                and 'EN'        = B.LANGUAGE_KEY
            left outer join VENDOR_NAME as C
                on  A.VENDOR_ID = C.VENDOR_ID
                and 'FR'        = C.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.VENDOR_ID        as ![VENDOR_ID],
                A.DISTRIBUTOR      as ![DISTRIBUTOR],
                A.VALID            as ![VALID],
                'X'                as ![BATCH_MODE] : String,
                B.VENDOR_DESC      as ![ERROR_CODES],
                B.VENDOR_DESC      as ![EN_DESC],
                C.VENDOR_DESC      as ![FR_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    define view programDeliveryLocationLangView as
        select from (
            PROG_DEL_LOCATION as A
            left outer join DEL_LOC_NAME as B
                on A.OBJECT_KEY = B.OBJECT_KEY
        ) {
            key A.OBJECT_KEY              as ![OBJECT_KEY],
            key B.LANGUAGE_KEY            as ![LANGUAGE_KEY],
                A.PROGRAM_UUID            as ![PROGRAM_UUID],
                A.VALID                   as ![VALID],
                A.VENDOR_ID               as ![VENDOR_ID],
                A.DEL_LOCATION_ID         as ![DEL_LOCATION_ID],
                A.ADDRESS.DEL_ADDRESS1    as ![DEL_ADDRESS1],
                A.ADDRESS.DEL_ADDRESS2    as ![DEL_ADDRESS2],
                A.ADDRESS.DEL_CITY        as ![DEL_CITY],
                A.ADDRESS.DEL_PROVINCE    as ![DEL_PROVINCE],
                A.ADDRESS.DEL_POSTAL_CODE as ![DEL_POSTAL_CODE],
                A.DEL_PHONE_NUMBER        as ![DEL_PHONE_NUMBER],
                B.DEL_LOCATION_NAME       as ![DEL_LOCATION_NAME],
                A.AUDIT.CHANGED_BY        as CHANGED_BY
        };

    define view programDealerDeliveryLocationView as
        select from (
            PROG_DEL_LOCATION as A
        ) {
            key A.OBJECT_KEY              as ![OBJECT_KEY],
                A.PROGRAM_UUID            as ![PROGRAM_UUID],
                A.VENDOR_ID               as ![VENDOR_ID],
                A.DEL_LOCATION_ID         as ![DEL_LOCATION_ID],
                A.ADDRESS.DEL_ADDRESS1    as ![DEL_ADDRESS1],
                A.ADDRESS.DEL_ADDRESS2    as ![DEL_ADDRESS2],
                A.ADDRESS.DEL_CITY        as ![DEL_CITY],
                A.ADDRESS.DEL_PROVINCE    as ![DEL_PROVINCE],
                A.ADDRESS.DEL_POSTAL_CODE as ![DEL_POSTAL_CODE],
                A.DEL_PHONE_NUMBER        as ![DEL_PHONE_NUMBER],
                A.AUDIT.CHANGED_BY        as CHANGED_BY
        }
        where
            A.VENDOR_TYPE = 'D3';

    define view programDeliveryLocationView as
        select from (
            PROG_DEL_LOCATION as A
            left outer join DEL_LOC_NAME as B
                on  A.OBJECT_KEY = B.OBJECT_KEY
                and 'EN'         = B.LANGUAGE_KEY
            left outer join DEL_LOC_NAME as C
                on  A.OBJECT_KEY = C.OBJECT_KEY
                and 'FR'         = C.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY              as ![OBJECT_KEY],
                A.PROGRAM_UUID            as ![PROGRAM_UUID],
                A.VENDOR_ID               as ![VENDOR_ID],
                A.DEL_LOCATION_ID         as ![DEL_LOCATION_ID],
                B.LANGUAGE_KEY            as ![LANG],
                B.DEL_LOCATION_NAME       as ![DEL_LOCATION_NAME],
                A.VALID                   as ![VALID],
                'X'                       as ![BATCH_MODE] : String,
                B.DEL_LOCATION_NAME       as ![ERROR_CODES],
                A.VENDOR_TYPE             as ![VENDOR_TYPE],
                B.DEL_LOCATION_NAME       as ![EN_DEL_LOCATION_NAME],
                C.DEL_LOCATION_NAME       as ![FR_DEL_LOCATION_NAME],
                A.ADDRESS.DEL_ADDRESS1    as ![DEL_ADDRESS1],
                A.ADDRESS.DEL_ADDRESS2    as ![DEL_ADDRESS2],
                A.ADDRESS.DEL_CITY        as ![DEL_CITY],
                A.ADDRESS.DEL_PROVINCE    as ![DEL_PROVINCE],
                A.ADDRESS.DEL_POSTAL_CODE as ![DEL_POSTAL_CODE],
                A.DEL_PHONE_NUMBER        as ![DEL_PHONE_NUMBER],
                A.AUDIT.CHANGED_BY        as ![CHANGED_BY]
        };

    define view deliveryMethodsView as
        select from DEL_METH_NAME {
            DEL_METHOD as ![DEL_METHOD]
        }
        group by
            DEL_METHOD;

    define view deliveryMethodNamesView as
        select from (
            deliveryMethodsView as A
            left outer join DEL_METH_NAME as B
                on  A.DEL_METHOD = B.DEL_METHOD
                and 'EN'         = B.LANGUAGE_KEY
            left outer join DEL_METH_NAME as C
                on  A.DEL_METHOD = C.DEL_METHOD
                and 'FR'         = C.LANGUAGE_KEY
        ) {
            key A.DEL_METHOD       as ![DEL_METHOD],
                B.DEL_METHOD_NAME  as ![EN_NAME],
                C.DEL_METHOD_NAME  as ![FR_NAME],
                B.AUDIT.CHANGED_BY as CHANGED_BY
        };

    define view deliveryMethodNameView as
            select from DEL_METH_NAME {
                key DEL_METHOD      as ![DEL_METHOD],
                key LANGUAGE_KEY    as ![LANGUAGE_KEY],
                    DEL_METHOD_NAME as ![DEL_METHOD_NAME]
            }
        union
            select from VENDOR_NAME {
                VENDOR_ID    as ![DEL_METHOD],
                LANGUAGE_KEY as ![LANGUAGE_KEY],
                VENDOR_DESC  as ![DEL_METHOD_NAME]
            };

    define view programDeliveryMethodView as
        select from (
            PROG_DEL_METHOD as A
            left outer join deliveryMethodNameView as B
                on  A.DEL_METHOD = B.DEL_METHOD
                and 'EN'         = B.LANGUAGE_KEY
            left outer join deliveryMethodNameView as C
                on  A.DEL_METHOD = C.DEL_METHOD
                and 'FR'         = C.LANGUAGE_KEY
            left outer join VENDOR_NAME as D
                on  A.VENDOR_ID = D.VENDOR_ID
                and 'EN'        = D.LANGUAGE_KEY
            left outer join VENDOR_NAME as E
                on  A.VENDOR_ID = E.VENDOR_ID
                and 'FR'        = E.LANGUAGE_KEY
            left outer join CATEGORY_NAME as F
                on  A.CATEGORY_ID = F.CATEGORY_ID
                and 'EN'          = F.LANGUAGE_KEY
            left outer join CATEGORY_NAME as G
                on  A.CATEGORY_ID = G.CATEGORY_ID
                and 'FR'          = G.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.VENDOR_ID        as ![VENDOR_ID],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                A.DEL_METHOD       as ![DEL_METHOD],
                A.VALID            as ![VALID],
                'X'                as ![BATCH_MODE] : String,
                B.DEL_METHOD_NAME  as ![ERROR_CODES],
                B.DEL_METHOD_NAME  as ![EN_DEL_M_NAME],
                C.DEL_METHOD_NAME  as ![FR_DEL_M_NAME],
                D.VENDOR_DESC      as ![EN_VENDOR_DESC],
                E.VENDOR_DESC      as ![FR_VENDOR_DESC],
                F.CATEGORY_DESC    as ![EN_CATEGORY_DESC],
                G.CATEGORY_DESC    as ![FR_CATEGORY_DESC],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY],
                F.DONOTTRANSPORT   as DONOTTRANSPORT
        };

    define view programDeliveryMethodLangView as
        select from (
            PROG_DEL_METHOD as A
            left outer join CATEGORY_NAME as D
                on A.CATEGORY_ID = D.CATEGORY_ID
            left outer join deliveryMethodNameView as B
                on  A.DEL_METHOD   = B.DEL_METHOD
                and D.LANGUAGE_KEY = B.LANGUAGE_KEY
            left outer join VENDOR_NAME as C
                on  A.VENDOR_ID    = C.VENDOR_ID
                and D.LANGUAGE_KEY = C.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key D.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.VALID            as ![VALID],
                A.VENDOR_ID        as ![VENDOR_ID],
                C.VENDOR_DESC      as ![VENDOR_DESC],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                D.CATEGORY_DESC    as ![CATEGORY_DESC],
                A.DEL_METHOD       as ![DEL_METHOD],
                B.DEL_METHOD_NAME  as ![DEL_METHOD_NAME],
                A.AUDIT.CHANGED_BY as CHANGED_BY,
                D.DONOTTRANSPORT   as DONOTTRANSPORT
        };

    define view programValidDeliveryMethodLangView as
        select from (
            PROG_DEL_METHOD as A
            left outer join CATEGORY_NAME as D
                on A.CATEGORY_ID = D.CATEGORY_ID
            left outer join deliveryMethodNameView as B
                on  A.DEL_METHOD   = B.DEL_METHOD
                and D.LANGUAGE_KEY = B.LANGUAGE_KEY
            left outer join VENDOR_NAME as C
                on  A.VENDOR_ID    = C.VENDOR_ID
                and D.LANGUAGE_KEY = C.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key D.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.VALID            as ![VALID],
                A.VENDOR_ID        as ![VENDOR_ID],
                C.VENDOR_DESC      as ![VENDOR_DESC],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                D.CATEGORY_DESC    as ![CATEGORY_DESC],
                A.DEL_METHOD       as ![DEL_METHOD],
                B.DEL_METHOD_NAME  as ![DEL_METHOD_NAME],
                A.AUDIT.CHANGED_BY as CHANGED_BY,
                D.DONOTTRANSPORT   as DONOTTRANSPORT
        }
        where
            A.VALID = 'X';

    define view programPartLangView as
        select from (
            PROG_PARTS as A
            left outer join PART_NAME as B
                on A.PART_NUM = B.PART_NUM
            left outer join VENDOR_NAME as C
                on  A.VENDOR_ID    = C.VENDOR_ID
                and B.LANGUAGE_KEY = C.LANGUAGE_KEY
            left outer join CATEGORY_NAME as D
                on  A.CATEGORY_ID  = D.CATEGORY_ID
                and B.LANGUAGE_KEY = D.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key B.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.PART_NUM         as ![PART_NUM],
                B.PART_DESC        as ![PART_DESC],
                A.DETAIL           as ![DETAIL],
                A.VALID            as ![VALID],
                A.VENDOR_ID        as ![VENDOR_ID],
                C.VENDOR_DESC      as ![VENDOR_DESC],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                D.CATEGORY_DESC    as ![CATEGORY_DESC],
                B.AUDIT.CHANGED_BY as ![CHANGED_BY],
                D.DONOTTRANSPORT   as DONOTTRANSPORT
        };

    define view programPartView as
        select from (
            PROG_PARTS as A
            left outer join PART_NAME as B
                on  A.PART_NUM = B.PART_NUM
                and 'EN'       = B.LANGUAGE_KEY
            left outer join PART_NAME as C
                on  A.PART_NUM = C.PART_NUM
                and 'FR'       = C.LANGUAGE_KEY
            left outer join VENDOR_NAME as D
                on  A.VENDOR_ID = D.VENDOR_ID
                and 'EN'        = D.LANGUAGE_KEY
            left outer join VENDOR_NAME as E
                on  A.VENDOR_ID = E.VENDOR_ID
                and 'FR'        = E.LANGUAGE_KEY
            left outer join CATEGORY_NAME as F
                on  A.CATEGORY_ID = F.CATEGORY_ID
                and 'EN'          = F.LANGUAGE_KEY
            left outer join CATEGORY_NAME as G
                on  A.CATEGORY_ID = G.CATEGORY_ID
                and 'FR'          = G.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.VENDOR_ID        as ![VENDOR_ID],
                A.CATEGORY_ID      as ![CATEGORY_ID],
                A.PART_NUM         as ![PART_NUM],
                A.DETAIL           as ![DETAIL],
                B.TIRESIZE         as ![TIRESIZE],
                B.SPEEDRATING      as ![SPEEDRATING],
                B.LOADRATING       as ![LOADRATING],
                B.DEALERNET        as ![DEALERNET],
                A.VALID            as ![VALID],
                'X'                as ![BATCH_MODE] : String,
                B.PART_DESC        as ![ERROR_CODES],
                B.PART_DESC        as ![EN_DESC],
                C.PART_DESC        as ![FR_DESC],
                D.VENDOR_DESC      as ![EN_VENDOR_DESC],
                E.VENDOR_DESC      as ![FR_VENDOR_DESC],
                F.CATEGORY_DESC    as ![EN_CATEGORY_DESC],
                G.CATEGORY_DESC    as ![FR_CATEGORY_DESC],
                B.AUDIT.CHANGED_BY as ![CHANGED_BY],
                F.DONOTTRANSPORT   as DONOTTRANSPORT
        };

    view programPriorPurchaseLangView as
        select from (
            PROG_PRIOR_PURCHASES as A
            left outer join PART_NAME as B
                on A.PART_NUM = B.PART_NUM
            left outer join VENDOR_NAME as C
                on  A.DEALER_CODE  = C.VENDOR_ID
                and B.LANGUAGE_KEY = C.LANGUAGE_KEY
            left outer join DEALER_INFO as D
                on A.DEALER_CODE = D.DEALER_CODE
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key B.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.DEALER_CODE      as ![DEALER_CODE],
                D.DEALER_CODE_S    as ![DEALER_CODE_S],
                C.VENDOR_DESC      as ![DEALER_DESC],
                A.PART_NUM         as ![PART_NUM],
                B.PART_DESC        as ![PART_DESC],
                A.PRIOR_PURCHASES  as ![PRIOR_PURCHASES],
                A.VALID            as ![VALID],
                B.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    view programPriorPurchaseMiniView as
        select from (
            PROG_PRIOR_PURCHASES as A
            left outer join PART_NAME as B
                on  A.PART_NUM = B.PART_NUM
                and 'EN'       = B.LANGUAGE_KEY
            left outer join PART_NAME as C
                on  A.PART_NUM = C.PART_NUM
                and 'FR'       = C.LANGUAGE_KEY
            left outer join VENDOR_NAME as D
                on  A.DEALER_CODE = D.VENDOR_ID
                and 'EN'          = D.LANGUAGE_KEY
            left outer join VENDOR_NAME as E
                on  A.DEALER_CODE = E.VENDOR_ID
                and 'FR'          = E.LANGUAGE_KEY
            left outer join DEALER_INFO as F
                on A.DEALER_CODE = F.DEALER_CODE
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.DEALER_CODE      as ![DEALER_CODE],
                F.DEALER_CODE_S    as ![DEALER_CODE_S],
                A.PART_NUM         as ![PART_NUM],
                A.PRIOR_PURCHASES  as ![PRIOR_PURCHASES],
                A.VALID            as ![VALID],
                'X'                as ![BATCH_MODE] : String,
                B.PART_DESC        as ![ERROR_CODES],
                B.PART_DESC        as ![EN_PART_DESC],
                C.PART_DESC        as ![FR_PART_DESC],
                D.VENDOR_DESC      as ![EN_DEALER_DESC],
                E.VENDOR_DESC      as ![FR_DEALER_DESC],
                B.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    define view programPartFitmentLangView as
        select from (
            PROG_PART_FITMENT as A
            left outer join PART_NAME as B
                on A.PART_NUM = B.PART_NUM
            left outer join MODEL_NAME as C
                on  A.MODEL_CODE   = C.MODEL_CODE
                and B.LANGUAGE_KEY = C.LANGUAGE_KEY
            left outer join VEHICLE_MODEL as D
                on A.MODEL_CODE = D.MODEL_CODE
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
            key B.LANGUAGE_KEY     as ![LANGUAGE_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.PART_NUM         as ![PART_NUM],
                B.PART_DESC        as ![PART_DESC],
                A.MODEL_CODE       as ![MODEL_CODE],
                C.MODEL_DESC       as ![MODEL_DESC],
                A.YEAR             as ![YEAR],
                A.VALID            as ![VALID],
                D.BRAND            as ![BRAND],
                D.BRAND_NAME       as ![BRAND_NAME],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY]
        };

    define view programPartFitmentView as
        select from (
            PROG_PART_FITMENT as A
            left outer join PART_NAME as B
                on  A.PART_NUM = B.PART_NUM
                and 'EN'       = B.LANGUAGE_KEY
            left outer join PART_NAME as C
                on  A.PART_NUM = C.PART_NUM
                and 'FR'       = C.LANGUAGE_KEY
            left outer join MODEL_NAME as D
                on  A.MODEL_CODE = D.MODEL_CODE
                and 'EN'         = D.LANGUAGE_KEY
            left outer join MODEL_NAME as E
                on  A.MODEL_CODE = E.MODEL_CODE
                and 'FR'         = E.LANGUAGE_KEY
            left outer join VEHICLE_MODEL as F
                on A.MODEL_CODE = F.MODEL_CODE
            left outer join TCISeries as G
                on  A.SERIES_CODE = G.SERIES_CODE
                and 'EN'          = G.LANGUAGE_KEY
            left outer join TCISeries as H
                on  A.SERIES_CODE = H.SERIES_CODE
                and 'FR'          = H.LANGUAGE_KEY
        ) {
            key A.OBJECT_KEY       as ![OBJECT_KEY],
                A.PROGRAM_UUID     as ![PROGRAM_UUID],
                A.PART_NUM         as ![PART_NUM],
                A.MODEL_CODE       as ![MODEL_CODE],
                A.SERIES_CODE      as ![SERIES_CODE],
                A.YEAR             as ![YEAR],
                A.VALID            as ![VALID],
                'X'                as ![BATCH_MODE] : String,
                B.PART_DESC        as ![ERROR_CODES],
                B.PART_DESC        as ![EN_PART_DESC],
                C.PART_DESC        as ![FR_PART_DESC],
                D.MODEL_DESC       as ![EN_MODEL_DESC],
                E.MODEL_DESC       as ![FR_MODEL_DESC],
                F.BRAND            as ![BRAND],
                F.BRAND_NAME       as ![BRAND_NAME],
                A.AUDIT.CHANGED_BY as ![CHANGED_BY],
                G.SERIES_DESC      as ![EN_SERIES_DESC],
                H.SERIES_DESC      as ![FR_SERIES_DESC]
        };


    @title: 'Booking	Program'
    entity BOOKING_PROGRAM {
            @title: 'Program UUID'
        key PROGRAM_UUID       : Core.OBJECT_UID_T;

            @title: 'Program ID'
            PROGRAM_ID         : Core.PROGRAM_ID_T not null;

            @title: 'Department'
            DEPART             : Core.DEPART_CODE_T not null;

            @title: 'Brand'
            BRAND              : Core.BRAND_T;

            @title: 'Booking window Open'
            OPEN_DATE          : Date;

            @title: 'Booking window CLOSE'
            CLOSE_DATE         : Date;

            @title: 'Initial Warning'
            INITIAL_WARN       : Decimal(2, 0);

            @title: 'Final Warning'
            FINAL_WARN         : Decimal(2, 0);

            @title: 'Delivery Window From'
            DELIVERY_FR        : Date;

            @title: 'Delivery Window to'
            DELIVERY_TO        : Date;

            @title: 'Comparative Program UUID'
            CPROGRAM_UUID      : Core.OBJECT_UID_T;

            @title: 'Status'
            STATUS             : Core.P_STATUS_T;
            AUDIT              : Core.AUDIT_T;
            toDescriptions     : Association[1, 0.. * ] to PROG_NAME
                                     on toDescriptions.PROGRAM_UUID = PROGRAM_UUID;
            toCategories       : Association[1, 0.. * ] to PROG_CATEGORY
                                     on toCategories.PROGRAM_UUID = PROGRAM_UUID;
            toVendors          : Association[1, 0.. * ] to PROG_VENDOR
                                     on toVendors.PROGRAM_UUID = PROGRAM_UUID;
            toDeliveryMethod   : Association[1, 0.. * ] to PROG_DEL_METHOD
                                     on toDeliveryMethod.PROGRAM_UUID = PROGRAM_UUID;
            toDeliveryLocation : Association[1, 0.. * ] to PROG_DEL_LOCATION
                                     on toDeliveryLocation.PROGRAM_UUID = PROGRAM_UUID;
            toPartFitment      : Association[1, 0.. * ] to PROG_PART_FITMENT
                                     on toPartFitment.PROGRAM_UUID = PROGRAM_UUID;
            toParts            : Association[1, 0.. * ] to PROG_PARTS
                                     on toParts.PROGRAM_UUID = PROGRAM_UUID;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_ID asc, DEPART asc);
    //     column store;
    // };


    @title: 'Program Description with Language'
    entity PROG_NAME {
            @title: 'Program UUID'
        key PROGRAM_UUID : Core.OBJECT_UID_T;

            @title: 'Language Key'
        key LANGUAGE_KEY : Core.LANGUAGE_KEY_T;

            @title: 'Description/Name'
            PROGRAM_DESC : Core.DESCRIPTION_T;
            AUDIT        : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Category Relation'
    entity PROG_CATEGORY {
            @title: 'Object Key'
        key OBJECT_KEY     : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID   : Core.OBJECT_UID_T not null;

            @title: 'Category ID'
            CATEGORY_ID    : Core.CATEGORY_ID_T not null;

            @title: 'Is Valid'
            VALID          : Core.YES_NO_T;
            AUDIT          : Core.AUDIT_T;
            toDescriptions : Association[1, 0.. * ] to CATEGORY_NAME
                                 on toDescriptions.CATEGORY_ID = CATEGORY_ID;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, CATEGORY_ID asc);
    //     column store;
    // };


    @title: 'Category Description/Name'
    entity CATEGORY_NAME {
            @title: 'Category ID'
        key CATEGORY_ID    : Core.CATEGORY_ID_T;

            @title: 'Language Key'
        key LANGUAGE_KEY   : Core.LANGUAGE_KEY_T;

            @title: 'Category Description/Name'
            CATEGORY_DESC  : Core.DESCRIPTION_T;

            @title: 'Transport Yes X or No'
            DONOTTRANSPORT : Core.YES_NO_T;
            AUDIT          : Core.AUDIT; //Edited by Devika (Core.AUDIT_T)


    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Vendor Relation'
    entity PROG_VENDOR {
            @title: 'Object Key'
        key OBJECT_KEY     : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID   : Core.OBJECT_UID_T not null;

            @title: 'Vendor Number'
            VENDOR_ID      : Core.VENDOR_ID_T not null;

            @title: 'Distributor Yes X or No'
            DISTRIBUTOR    : Core.YES_NO_T;

            @title: 'Is Valid'
            VALID          : Core.YES_NO_T;
            AUDIT          : Core.AUDIT_T;
            toDescriptions : Association[1, 0.. * ] to VENDOR_NAME
                                 on toDescriptions.VENDOR_ID = VENDOR_ID;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, VENDOR_ID asc);
    //     column store;
    // };


    @title: 'Vendor Description/Name'
    entity VENDOR_NAME {
            @title: 'Category ID'
        key VENDOR_ID    : Core.VENDOR_ID_T;

            @title: 'Language Key'
        key LANGUAGE_KEY : Core.LANGUAGE_KEY_T;

            @title: 'Category Description/Name'
            VENDOR_DESC  : Core.DESCRIPTION_T;
            AUDIT        : Core.AUDIT_T;

            @title: 'Transport Yes X or No'
            DISTRIBUTOR  : Core.YES_NO_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Delivery Method Relation'
    entity PROG_DEL_METHOD {
            @title: 'Object Key'
        key OBJECT_KEY     : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID   : Core.OBJECT_UID_T not null;

            @title: 'Vendor Number/ID'
            VENDOR_ID      : Core.VENDOR_ID_T not null;

            @title: 'Category ID'
            CATEGORY_ID    : Core.CATEGORY_ID_T not null;

            @title: 'Delivery Method ID'
            DEL_METHOD     : Core.DEL_METHOD_ID_T not null;

            @title: 'Is Valid'
            VALID          : Core.YES_NO_T;
            AUDIT          : Core.AUDIT_T;
            toDescriptions : Association[1, 0.. * ] to DEL_METH_NAME
                                 on toDescriptions.DEL_METHOD = DEL_METHOD;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, VENDOR_ID asc, CATEGORY_ID asc, DEL_METHOD asc);
    //     column store;
    // };


    @title: 'Delivery Method Name with Language'
    entity DEL_METH_NAME {
            @title: 'Delivery Method ID'
        key DEL_METHOD      : Core.DEL_METHOD_ID_T;

            @title: 'Language Key'
        key LANGUAGE_KEY    : Core.LANGUAGE_KEY_T;

            @title: 'Delivery Method Description/Name'
            DEL_METHOD_NAME : Core.DESCRIPTION_T;
            AUDIT           : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Delivery Location Relation'
    entity PROG_DEL_LOCATION {
            @title: 'Object Key/ Delivery Location UUID'
        key OBJECT_KEY       : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID     : Core.OBJECT_UID_T not null;

            @title: 'Vendor Number/ID'
            VENDOR_ID        : Core.VENDOR_ID_T not null;

            @title: 'Delivery Location ID'
            DEL_LOCATION_ID  : Core.DEL_LOCATION_ID_T not null;

            @title: 'Phone Number'
            DEL_PHONE_NUMBER : String(10);

            @title: 'For dealer, mark as DL, default null'
            VENDOR_TYPE      : String(2);

            @title: 'Is Valid'
            VALID            : Core.YES_NO_T;
            ADDRESS          : Core.ADDRESS_T;
            AUDIT            : Core.AUDIT_T;
            toDescriptions   : Association[1, 0.. * ] to DEL_LOC_NAME
                                   on toDescriptions.OBJECT_KEY = OBJECT_KEY;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, VENDOR_ID asc, DEL_LOCATION_ID asc);
    //     column store;
    // };


    @title: 'Delivery Location Description/Name'
    entity DEL_LOC_NAME {
            @title: 'Object Key/ Delivery Location UUID'
        key OBJECT_KEY        : Core.OBJECT_UID_T;

            @title: 'Language Key'
        key LANGUAGE_KEY      : Core.LANGUAGE_KEY_T;

            @title: 'Delivery Location Description/Name'
            DEL_LOCATION_NAME : Core.DESCRIPTION_T;
            AUDIT             : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Part Relation'
    entity PROG_PARTS {
            @title: 'Object Key'
        key OBJECT_KEY     : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID   : Core.OBJECT_UID_T not null;

            @title: 'Part Number'
            PART_NUM       : Core.PART_NUM_T not null;

            @title: 'Category ID'
            CATEGORY_ID    : Core.CATEGORY_ID_T not null;

            @title: 'Vendor Number/ID'
            VENDOR_ID      : Core.VENDOR_ID_T not null;

            @title: 'Detail Information'
            DETAIL         : String(255);

            @title: 'Is Valid'
            VALID          : Core.YES_NO_T;
            AUDIT          : Core.AUDIT_T;
            toDescriptions : Association[1, 0.. * ] to PART_NAME
                                 on toDescriptions.PART_NUM = PART_NUM;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, PART_NUM asc, CATEGORY_ID asc, VENDOR_ID asc);
    //     column store;
    // };


    @title: 'Part Description'
    entity PART_NAME {
            @title: 'Part Number'
        key PART_NUM     : Core.PART_NUM_T;

            @title: 'Language Key'
        key LANGUAGE_KEY : Core.LANGUAGE_KEY_T;

            @title: 'Tire Size'
            TIRESIZE     : Core.TIRESIZE_T;

            @title: 'Speed Rating'
            SPEEDRATING  : Core.SPEEDRATING_T;

            @title: 'Load Rating'
            LOADRATING   : Core.LOADRATING_T;

            @title: 'Dealer Net'
            DEALERNET    : Core.DEALERNET_T;

            @title: 'Part Description/Name'
            PART_DESC    : Core.DESCRIPTION_T;
            AUDIT        : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Vehicle - TCISeries '
    entity TCISeries {
            @title: 'Vehicle - TCISERIES CODE'
        key SERIES_CODE  : String(3);

            @title: 'Language Key'
        key LANGUAGE_KEY : Core.LANGUAGE_KEY_T;

            @title: 'Vehicle Model Description/Name'
            SERIES_DESC  : Core.DESCRIPTION_T;
            AUDIT        : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Part Fitment Relation'
    entity PROG_PART_FITMENT {
            @title: 'Object Key'
        key OBJECT_KEY     : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID   : Core.OBJECT_UID_T not null;

            @title: 'Part Number'
            PART_NUM       : Core.PART_NUM_T not null;

            @title: 'Vehicle - Toyota Model Code'
            MODEL_CODE     : Core.MODEL_CODE_T not null;

            @title: 'Vehicle - Toyota Model Year'
            YEAR           : String(4) not null;

            @title: 'Vehicle - Toyota Series Code'
            SERIES_CODE    : String(3) not null;

            @title: 'Is Valid'
            VALID          : Core.YES_NO_T;
            AUDIT          : Core.AUDIT_T;
            toVehicleModel : Association[1, 0.. * ] to VEHICLE_MODEL
                                 on toVehicleModel.MODEL_CODE = MODEL_CODE;
            toTCISeries    : Association[1, 0.. * ] to TCISeries
                                 on toTCISeries.SERIES_CODE = SERIES_CODE;
    }
    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, PART_NUM asc, MODEL_CODE asc, YEAR asc);
    //     column store;
    // };


    @title: 'Vehicle - Toyota Model Code '
    entity MODEL_NAME {
            @title: 'Vehicle - Toyota Model Code'
        key MODEL_CODE   : Core.MODEL_CODE_T;

            @title: 'Language Key'
        key LANGUAGE_KEY : Core.LANGUAGE_KEY_T;

            @title: 'SeriesCode'
            SERIES_CODE  : String(3);

            @title: 'Vehicle Model Description/Name'
            MODEL_DESC   : Core.DESCRIPTION_T;
            AUDIT        : Core.AUDIT_T;
            toTCISeries  : Association[1, 0.. * ] to TCISeries
                               on toTCISeries.SERIES_CODE = SERIES_CODE;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'VEHICLE'
    entity VEHICLE_MODEL {
            @title: 'Vehicle Model Code'
        key MODEL_CODE     : Core.MODEL_CODE_T;

            @title: 'Brand'
            BRAND          : Core.BRAND_T;

            @title: 'Brand Name'
            BRAND_NAME     : String(10);
            AUDIT          : Core.AUDIT_T;
            toDescriptions : Association[1, 0.. * ] to MODEL_NAME
                                 on toDescriptions.MODEL_CODE = MODEL_CODE;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Dealer Information '
    entity DEALER_INFO {
            @title: 'Dealer Code'
        key DEALER_CODE   : Core.VENDOR_ID_T;

            @title: 'Dealer Code - TCI Short '
            DEALER_CODE_S : Core.DEALER_CODE_S_T not null;

            @title: 'Dealer Name'
            DEALER_NAME   : Core.DESCRIPTION_T;

            AUDIT         : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Program Prior Purchase Relation'
    entity PROG_PRIOR_PURCHASES {
            @title: 'Object Key'
        key OBJECT_KEY      : Core.OBJECT_UID_T not null;

            @title: 'Program UUID'
            PROGRAM_UUID    : Core.OBJECT_UID_T not null;

            @title: 'Dealer Code'
            DEALER_CODE     : Core.VENDOR_ID_T not null;

            @title: 'Part Number'
            PART_NUM        : Core.PART_NUM_T not null;

            @title: 'Prior Purchase'
            PRIOR_PURCHASES : Decimal(13, 0);

            @title: 'Prior booking'
            PRIOR_BOOKING   : Decimal(13, 0);

            @title: 'Category'
            CATEGORY_ID     : Core.CATEGORY_ID_T;

            @title: 'Booking window Open'
            BOOKING_OPEN    : Date;

            @title: 'Booking window CLOSE'
            BOOKING_CLOSE   : Date;

            @title: 'Is Valid'
            VALID           : Core.YES_NO_T;
            AUDIT           : Core.AUDIT_T;
            toDealerName    : Association[1, 0.. * ] to VENDOR_NAME
                                  on toDealerName.VENDOR_ID = DEALER_CODE;
            toPartInfo      : Association[1, 0.. * ] to PART_NAME
                                  on toPartInfo.PART_NUM = PART_NUM;
    }

    // technical configuration {
    //     index index_m1 on (PROGRAM_UUID asc, PART_NUM asc, DEALER_CODE asc);
    //     column store;
    // };

    // @cds.api.ignore
    // @assert.notNull: false
    // validFrom : Timestamp not null;
    // @cds.api.ignore
    // @assert.notNull: false
    // validTo : Timestamp not null;
    // entity bookingProgramSummary_Table :temporal {
    //     PROGRAM_UUID  : String;
    //     PROGRAM_ID    : String;
    //     DEPART        : String;
    //     BRAND         : String;
    //     OPEN_DATE     : Date;
    //     CLOSE_DATE    : Date;
    //     INITIAL_WARN  : Integer;
    //     FINAL_WARN    : Integer;
    //     DELIVERY_FR   : Date;
    //     DELIVERY_TO   : Date;
    //     CPROGRAM_UUID : String;
    //     STATUS        : String;
    //     EN_DESC       : String;
    //     FR_DESC       : String;
    //     CHANGED_BY    : String;

    //     @cds.api.ignore
    //     @assert.notNull: false
    //     validFrom     : Timestamp not null;

    //     @cds.api.ignore
    //     @assert.notNull: false
    //     validTo       : Timestamp not null;
    // // validFrom     : Date @cds.valid.from;
    // // validTo       : Date @cds.valid.to;
    // }

    entity bookingProgramStatus_Table {
        PROGRAM_UUID  : String(36);
        DEALER_CODE   : String(20);
        DEALER_CODE_S : String(6);
        B_STATUS      : String(2);
        CREATED_BY    : String(36)
    }

    entity bookingProgramSummary_Table {
        PROGRAM_UUID  : String;
        PROGRAM_ID    : String;
        DEPART        : String;
        BRAND         : String;
        OPEN_DATE     : Date;
        CLOSE_DATE    : Date;
        INITIAL_WARN  : Integer;
        FINAL_WARN    : Integer;
        DELIVERY_FR   : Date;
        DELIVERY_TO   : Date;
        CPROGRAM_UUID : String;
        STATUS        : String;
        EN_DESC       : String;
        FR_DESC       : String;
        CHANGED_BY    : String;

    // @cds.api.ignore
    // @assert.notNull: false
    // validFrom     : Timestamp not null;

    // @cds.api.ignore
    // @assert.notNull: false
    // validTo       : Timestamp not null;
    // validFrom     : Date @cds.valid.from;
    // validTo       : Date @cds.valid.to;
    }

    entity bookingProgramSummaryNew_Table {
        PROGRAM_UUID  : String;
        PROGRAM_ID    : String;
        DEPART        : String;
        BRAND         : String;
        OPEN_DATE     : Date;
        CLOSE_DATE    : Date;
        INITIAL_WARN  : Integer;
        FINAL_WARN    : Integer;
        DELIVERY_FR   : Date;
        DELIVERY_TO   : Date;
        CPROGRAM_UUID : String;
        STATUS        : String;
        EN_DESC       : String;
        FR_DESC       : String;
        CHANGED_BY    : String;
    }


    entity dealerBookingPeriod_Table {
        PROGRAM_UUID  : String(36);
        DEALER_CODE   : String(20);
        DEALER_CODE_S : String(6);
        DEALER_NAME   : String;
        PART_NUM      : String(100);
        VENDOR_ID     : String(20);
        CATEGORY_ID   : String(18);
        MMYYYY        : String(6);
        PERIOD_DT     : Date;
        ORDER_QTY     : Integer;
        CHANGED_BY    : String;
    }

    entity DEALERBOOKINGDELIVERYPERIOD_TABLE {
        PROGRAM_UUID  : String(36);
        DEALER_CODE   : String(20);
        VENDOR_ID     : String(20);
        CATEGORY_ID   : String(18);
        MMYYYY        : String(6);
        PERIOD_DT     : Date;
        SCHEDULE_DATE : Date;
        CHANGED_BY    : String;
    }

    entity dealerBookingDelivery_Table {
        PROGRAM_UUID        : String(36);
        DEALER_CODE         : String(20);
        VENDOR_ID           : String(20);
        CATEGORY_ID         : String(18);
        DEL_METHOD          : String(20);
        DEL_LOCATION_UUID   : String(36);
        SPECIAL_INSTRUCTION : String(250);
        CHANGED_BY          : String;
    }

    entity programCategory_Table {
        OBJECT_KEY     : String(36);
        PROGRAM_UUID   : String(36);
        CATEGORY_ID    : String(18);
        VALID          : String(1);
        BATCH_MODE     : String(1);
        ERROR_CODES    : String(100);
        EN_DESC        : String(100);
        FR_DESC        : String(100);
        CHANGED_BY     : String(36);
        DONOTTRANSPORT : String(1);
    }

    entity programCategoryNew_Table {
        OBJECT_KEY     : String(36);
        PROGRAM_UUID   : String(36);
        CATEGORY_ID    : String(18);
        VALID          : String(1);
        BATCH_MODE     : String(1);
        ERROR_CODES    : String(100);
        EN_DESC        : String(100);
        FR_DESC        : String(100);
        CHANGED_BY     : String(36);
        DONOTTRANSPORT : String(1);
    }

    entity programVendor_Table {
        OBJECT_KEY   : String(36);
        PROGRAM_UUID : String(36);
        VENDOR_ID    : String(20);
        DISTRIBUTOR  : String(1);
        VALID        : String(1);
        BATCH_MODE   : String(1);
        ERROR_CODES  : String(100);
        EN_DESC      : String(100);
        FR_DESC      : String(100);
        CHANGED_BY   : String(36);
    }

    entity programVendorNew_Table {
        OBJECT_KEY   : String(36);
        PROGRAM_UUID : String(36);
        VENDOR_ID    : String(20);
        DISTRIBUTOR  : String(1);
        VALID        : String(1);
        BATCH_MODE   : String(1);
        ERROR_CODES  : String(100);
        EN_DESC      : String(100);
        FR_DESC      : String(100);
        CHANGED_BY   : String(36);
    }

    entity programDeliveryLocation_Table {
        OBJECT_KEY           : String(36);
        PROGRAM_UUID         : String(36);
        VENDOR_ID            : String(20);
        DEL_LOCATION_ID      : String(10);
        LANG                 : String(2);
        DEL_LOCATION_NAME    : String(100);
        VALID                : String(1);
        BATCH_MODE           : String(1);
        ERROR_CODES          : String(100);
        VENDOR_TYPE          : String(2);
        EN_DEL_LOCATION_NAME : String(100);
        FR_DEL_LOCATION_NAME : String(100);
        DEL_ADDRESS1         : String(50);
        DEL_ADDRESS2         : String(50);
        DEL_CITY             : String(50);
        DEL_PROVINCE         : String(2);
        DEL_POSTAL_CODE      : String(6);
        DEL_PHONE_NUMBER     : String(10);
        CHANGED_BY           : String(36);
    }

    entity programDeliveryLocationNew_Table {
        OBJECT_KEY           : String(36);
        PROGRAM_UUID         : String(36);
        VENDOR_ID            : String(20);
        DEL_LOCATION_ID      : String(10);
        LANG                 : String(2);
        DEL_LOCATION_NAME    : String(100);
        VALID                : String(1);
        BATCH_MODE           : String(1);
        ERROR_CODES          : String(100);
        VENDOR_TYPE          : String(2);
        EN_DEL_LOCATION_NAME : String(100);
        FR_DEL_LOCATION_NAME : String(100);
        DEL_ADDRESS1         : String(50);
        DEL_ADDRESS2         : String(50);
        DEL_CITY             : String(50);
        DEL_PROVINCE         : String(2);
        DEL_POSTAL_CODE      : String(6);
        DEL_PHONE_NUMBER     : String(10);
        CHANGED_BY           : String(36);
    }

    entity programDeliveryMethod_Table {
        OBJECT_KEY       : String(36);
        PROGRAM_UUID     : String(36);
        VENDOR_ID        : String(20);
        CATEGORY_ID      : String(18);
        DEL_METHOD       : String(20);
        VALID            : String(1);
        BATCH_MODE       : String(1);
        ERROR_CODES      : String(100);
        EN_DEL_M_NAME    : String(100);
        FR_DEL_M_NAME    : String(100);
        EN_VENDOR_DESC   : String(100);
        FR_VENDOR_DESC   : String(100);
        EN_CATEGORY_DESC : String(100);
        FR_CATEGORY_DESC : String(100);
        CHANGED_BY       : String(36);
        DONOTTRANSPORT   : String(1);
    }

    entity programPart_Table {
        OBJECT_KEY       : String(36);
        PROGRAM_UUID     : String(36);
        VENDOR_ID        : String(20);
        CATEGORY_ID      : String(18);
        PART_NUM         : String(40);
        DETAIL           : String;
        TIRESIZE         : String(40);
        SPEEDRATING      : String(1);
        LOADRATING       : String(3);
        DEALERNET        : String(40);
        VALID            : String(1);
        BATCH_MODE       : String(1);
        ERROR_CODES      : String(100);
        EN_DESC          : String(100);
        FR_DESC          : String(100);
        EN_VENDOR_DESC   : String(100);
        FR_VENDOR_DESC   : String(100);
        EN_CATEGORY_DESC : String(100);
        FR_CATEGORY_DESC : String(100);
        CHANGED_BY       : String(36);
        DONOTTRANSPORT   : String(1);
    }

    entity programPartFitment_Table {
        OBJECT_KEY     : String(36);
        PROGRAM_UUID   : String(36);
        PART_NUM       : String(40);
        MODEL_CODE     : String(7);
        SERIES_CODE    : String(3);
        YEAR           : String(4);
        VALID          : String(1);
        BATCH_MODE     : String(1);
        ERROR_CODES    : String(100);
        EN_PART_DESC   : String(100);
        FR_PART_DESC   : String(100);
        EN_MODEL_DESC  : String(100);
        FR_MODEL_DESC  : String(100);
        BRAND          : String(2);
        BRAND_NAME     : String(10);
        CHANGED_BY     : String(36);
        EN_SERIES_DESC : String(36);
        FR_SERIES_DESC : String(36);
    }

    entity programPriorPurchase_Table {
        OBJECT_KEY      : String(36);
        PROGRAM_UUID    : String(36);
        BRAND           : String(2);
        DEALER_CODE     : String(20);
        DEALER_CODE_S   : String(6);
        PART_NUM        : String(40);
        PRIOR_PURCHASES : Integer;
        VALID           : String(1);
        BATCH_MODE      : String(1);
        ERROR_CODES     : String(100);
            EN_PART_DESC    : String(100);
            FR_PART_DESC    : String(100);
        EN_DEALER_DESC  : String(100);
        FR_DEALER_DESC  : String(100);
        CHANGED_BY      : String(36);
    }

    entity programVendorAll_Table {
        PROGRAM_UUID : String(36);
        COUNT        : Integer;
    }
}
