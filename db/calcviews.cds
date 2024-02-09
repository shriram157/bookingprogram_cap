@cds.persistence.exists
@cds.persistence.calcview
entity BOOKINGPARTSDELIVERYVIEW(PROGRAMUUID : String(36)) {
        MMYYYY           : String(6)   @title: 'MMYYYY: MMYYYY';
        PERIOD_DT        : Date        @title: 'PERIOD_DT: VALUE FOR SORTING';
        ORDER_QTY        : Decimal(13) @title: 'ORDER_QTY: ORDER QUANTITY';
        SCHEDULE_DATE    : Date        @title: 'SCHEDULE_DATE: SCHEDULE DATE, MOST LIKE SORT ON DATE';
        B_STATUS         : String(2)   @title: 'B_STATUS: BOOKING STATUS';
        AUDIT_CHANGED_ON : String      @title: 'AUDIT_CHANGED_ON: CHANGED ON';
        AUDIT_CHANGED_BY : String(36)  @title: 'AUDIT_CHANGED_BY: CHANGED BY';
        PROGRAM_UUID     : String(36)  @title: 'PROGRAM_UUID: PROGRAM_UUID';
        DEALER_CODE      : String(20)  @title: 'DEALER_CODE: DEALER_CODE';
        VENDOR_ID        : String(20)  @title: 'VENDOR_ID: VENDOR_ID';
        CATEGORY_ID      : String(18)  @title: 'CATEGORY_ID: CATEGORY_ID';
        PART_NUM         : String(40)  @title: 'PART_NUM: PART_NUM';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGCATEGORYDELIVERYSCHEDULEVIEW {
        PROGRAM_UUID  : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        DEALER_CODE   : String(20)  @title: 'DEALER_CODE: DEALER CODE';
        VENDOR_ID     : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER';
        CATEGORY_ID   : String(18)  @title: 'CATEGORY_ID: CATEGORY ATRIBUTES';
        MMYYYY        : String(6)   @title: 'MMYYYY: MMYYYY';
        ORDER_QTY     : Decimal(13) @title: 'ORDER_QTY: ORDER QUANTITY';
        COUNTER       : Integer     @title: 'COUNTER: SEQUENCE COUNTER, AKA A LINE NUMBER, MAY BE HAS NO USE';
        SCHEDULE_DATE : Date        @title: 'SCHEDULE_DATE: SCHEDULE DATE, MOST LIKE SORT ON DATE';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGCATEGORYDELIVERYVIEW(DEALERCODE : String(20), LANG : String(2), PROGRAMUUID : String(36)) {
        PROGRAM_UUID        : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        DEALER_CODE         : String(20)  @title: 'DEALER_CODE: DEALER CODE';
        DEALER_CODE_EXIST   : String(20)  @title: 'DEALER_CODE_EXIST: DEALER CODE EXISTING';
        LANGUAGE_KEY        : String(2)   @title: 'LANGUAGE_KEY: LANGUAGE KEY';
        CATEGORY_ID         : String(18)  @title: 'CATEGORY_ID: CATEGORY';
        CATEGORY_DESC       : String(100) @title: 'CATEGORY_DESC: CATEGORY DESCRIPTION';
        VENDOR_ID           : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER';
        VENDOR_DESC         : String(100) @title: 'VENDOR_DESC: CATEGORY DESCRIPTION';
        DEL_METHOD          : String(20)  @title: 'DEL_METHOD: DELIVERY METHOD ID - FK';
        DEL_LOCATION_UUID   : String(36)  @title: 'DEL_LOCATION_UUID: DELIVERY LOCATION UUID';
        SPECIAL_INSTRUCTION : String(250) @title: 'SPECIAL_INSTRUCTION: VENDOR NUMBER';
        B_STATUS            : String(2)   @title: 'B_STATUS: BOOKING STATUS';
        AUDIT_CHANGED_ON    : String      @title: 'AUDIT_CHANGED_ON: CHANGED ON';
        AUDIT_CHANGED_BY    : String(36)  @title: 'AUDIT_CHANGED_BY: CHANGED BY';
}
//

@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGPARTPERIODVIEW(INDEALERCODE : String(20), LANG : String(2), PROGRAMUUID : String(36)) {
        PROGRAM_UUID       : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        DEALER_CODE_EXIST  : String(20)  @title: 'DEALER_CODE_EXIST: DEALER CODE';
        DEALER_CODE        : String(20)  @title: 'DEALER_CODE: DEALERCODE';
        DEALER_DESC        : String(100) @title: 'DEALER_DESC: CATEGORY DESCRIPTION';
        CATEGORY_ID_META   : String(18)  @title: 'CATEGORY_ID_META: CATEGORY';
        CATEGORY_ID        : String(18)  @title: 'CATEGORY_ID: CATEGORY';
        PART_NUM           : String(40)  @title: 'PART_NUM: PART NUMBER';
        PART_DESC          : String(100) @title: 'PART_DESC: PART DESCRIPTION';
        VENDOR_ID          : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER';
        VENDOR_DESC        : String(100) @title: 'VENDOR_DESC: CATEGORY DESCRIPTION';
        DEALER_NET         : Decimal(13) @title: 'DEALER_NET: PRIOR BOOKING';
        PRIOR_PURCHASES    : Decimal(13) @title: 'PRIOR_PURCHASES: PRIOR PURCHASE';
        PRIOR_PURCHASES_PR : Decimal(13) @title: 'PRIOR_PURCHASES_PR: PRIOR PURCHASE';
        PRIOR_BOOKING      : Decimal(13) @title: 'PRIOR_BOOKING: PRIOR BOOKING';
        PRIOR_BOOKING_PR   : Decimal(14) @title: 'PRIOR_BOOKING_PR: ORDER_TOTAL';
        B_STATUS           : String(2)   @title: 'B_STATUS: BOOKING STATUS';
        DETAIL             : String(255) @title: 'DETAIL: DETAIL - SHORT NOTES';
        AUDIT_CHANGED_ON   : String      @title: 'AUDIT_CHANGED_ON: CHANGED ON';
        AUDIT_CHANGED_BY   : String(36)  @title: 'AUDIT_CHANGED_BY: CHANGED BY';
        F0_VALUE           : Decimal(13) @title: 'F0_VALUE: F0_VALUE';
        F1_VALUE           : Decimal(13) @title: 'F1_VALUE: F1_VALUE';
        F2_VALUE           : Decimal(13) @title: 'F2_VALUE: F2_VALUE';
        F3_VALUE           : Decimal(13) @title: 'F3_VALUE: F3_VALUE';
        F4_VALUE           : Decimal(13) @title: 'F4_VALUE: F4_VALUE';
        F5_VALUE           : Decimal(13) @title: 'F5_VALUE: F5_VALUE';
        I6_TOTAL           : Decimal(14) @title: 'I6_TOTAL: I6_TOTAL';
        TIRESIZE           : String(40)  @title: 'TIRESIZE: TIRESIZE';
        SPEEDRATING        : String(1)   @title: 'SPEEDRATING: SPEED RATING';
        LOADRATING         : String(3)   @title: 'LOADRATING: LOAD RATING';
        DEALERNET          : String(40)  @title: 'DEALERNET: DEALER NET';
        SERIES_CODE        : String(3)   @title: 'SERIES_CODE: VEHICLE - TOYOTA SERIES CODE';
        YEAR               : String(4)   @title: 'YEAR: VEHICLE - TOYOTA MODEL YEAR';
        SERIES_DESC        : String(100) @title: 'SERIES_DESC: SERIES_DESC';
        F2_PERIOD          : String(6)   @title: 'F2_PERIOD: F2_PERIOD';
        F4_PERIOD          : String(6)   @title: 'F4_PERIOD: F4_PERIOD';
        F3_PERIOD          : String(6)   @title: 'F3_PERIOD: F3_PERIOD';
        F5_PERIOD          : String(6)   @title: 'F5_PERIOD: F5_PERIOD';
        F0_PERIOD          : String(6)   @title: 'F0_PERIOD: F0_PERIOD';
        F1_PERIOD          : String(6)   @title: 'F1_PERIOD: F1_PERIOD';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGPARTVENDORPERIODVIEW(INDEALERCODE : String(20), LANG : String(2), PROGRAMUUID : String(36)) {
        PROGRAM_UUID       : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        DEALER_CODE_EXIST  : String(20)  @title: 'DEALER_CODE_EXIST: DEALER CODE';
        DEALER_CODE        : String(20)  @title: 'DEALER_CODE: DEALERCODE';
        DEALER_DESC        : String(100) @title: 'DEALER_DESC: CATEGORY DESCRIPTION';
        CATEGORY_ID_META   : String(18)  @title: 'CATEGORY_ID_META: CATEGORY';
        CATEGORY_ID        : String(18)  @title: 'CATEGORY_ID: CATEGORY';
        PART_NUM           : String(40)  @title: 'PART_NUM: PART NUMBER';
        PART_DESC          : String(100) @title: 'PART_DESC: PART DESCRIPTION';
        VENDOR_ID          : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER';
        VENDOR_DESC        : String(100) @title: 'VENDOR_DESC: CATEGORY DESCRIPTION';
        DEALER_NET         : Decimal(13) @title: 'DEALER_NET: PRIOR BOOKING';
        PRIOR_PURCHASES    : Decimal(13) @title: 'PRIOR_PURCHASES: PRIOR PURCHASE';
        PRIOR_PURCHASES_PR : Decimal(13) @title: 'PRIOR_PURCHASES_PR: PRIOR PURCHASE';
        PRIOR_BOOKING      : Decimal(13) @title: 'PRIOR_BOOKING: PRIOR BOOKING';
        PRIOR_BOOKING_PR   : Decimal(14) @title: 'PRIOR_BOOKING_PR: ORDER_TOTAL';
        B_STATUS           : String(2)   @title: 'B_STATUS: BOOKING STATUS';
        DETAIL             : String(255) @title: 'DETAIL: DETAIL - SHORT NOTES';
        AUDIT_CHANGED_ON   : String      @title: 'AUDIT_CHANGED_ON: CHANGED ON';
        AUDIT_CHANGED_BY   : String(36)  @title: 'AUDIT_CHANGED_BY: CHANGED BY';
        F0_VALUE           : Decimal(13) @title: 'F0_VALUE: F0_VALUE';
        F1_VALUE           : Decimal(13) @title: 'F1_VALUE: F1_VALUE';
        F2_VALUE           : Decimal(13) @title: 'F2_VALUE: F2_VALUE';
        F3_VALUE           : Decimal(13) @title: 'F3_VALUE: F3_VALUE';
        F4_VALUE           : Decimal(13) @title: 'F4_VALUE: F4_VALUE';
        F5_VALUE           : Decimal(13) @title: 'F5_VALUE: F5_VALUE';
        I6_TOTAL           : Decimal(14) @title: 'I6_TOTAL: I6_TOTAL';
        TIRESIZE           : String(40)  @title: 'TIRESIZE: TIRESIZE';
        SPEEDRATING        : String(1)   @title: 'SPEEDRATING: SPEED RATING';
        LOADRATING         : String(3)   @title: 'LOADRATING: LOAD RATING';
        DEALERNET          : String(40)  @title: 'DEALERNET: DEALER NET';
        F2_PERIOD          : String(6)   @title: 'F2_PERIOD: F2_PERIOD';
        F4_PERIOD          : String(6)   @title: 'F4_PERIOD: F4_PERIOD';
        F3_PERIOD          : String(6)   @title: 'F3_PERIOD: F3_PERIOD';
        F5_PERIOD          : String(6)   @title: 'F5_PERIOD: F5_PERIOD';
        F0_PERIOD          : String(6)   @title: 'F0_PERIOD: F0_PERIOD';
        F1_PERIOD          : String(6)   @title: 'F1_PERIOD: F1_PERIOD';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGREPORTCALCULATION(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        PROGRAM_UUID        : String(36)  @title: 'PROGRAM_UUID: PROGRAM_UUID';
        PROGRAM_ID          : String(40)  @title: 'PROGRAM_ID: PROGRAM_ID';
        STATUS              : String(10)  @title: 'STATUS: STATUS';
        VENDOR_ID           : String(20)  @title: 'VENDOR_ID: VENDOR_ID';
        VENDOR_DESC         : String(100) @title: 'VENDOR_DESC: VENDOR_DESC';
        DEALER_CODE         : String(20)  @title: 'DEALER_CODE: DEALER_CODE';
        DEALER_NAME         : String(100) @title: 'DEALER_NAME: DEALER_NAME';
        DEALER_CODE_S       : String(6)   @title: 'DEALER_CODE_S: DEALER_CODE_S';
        CATEGORY_ID         : String(18)  @title: 'CATEGORY_ID: CATEGORY_ID';
        CATEGORY_DESC       : String(100) @title: 'CATEGORY_DESC: CATEGORY_DESC';
        PART_NUM            : String(40)  @title: 'PART_NUM: PART_NUM';
        PART_DESC           : String(100) @title: 'PART_DESC: PART_DESC';
        DETAIL              : String(255) @title: 'DETAIL: DETAIL';
        MMYYYY              : String(6)   @title: 'MMYYYY: MMYYYY';
        ORDER_QTY           : Decimal(13) @title: 'ORDER_QTY: ORDER_QTY';
        SCHEDULE_DATE       : Date        @title: 'SCHEDULE_DATE: SCHEDULE_DATE';
        DEL_METHOD          : String(20)  @title: 'DEL_METHOD: DEL_METHOD';
        DEL_METHOD_NAME     : String(100) @title: 'DEL_METHOD_NAME: DEL_METHOD_NAME';
        SPECIAL_INSTRUCTION : String(250) @title: 'SPECIAL_INSTRUCTION: SPECIAL_INSTRUCTION';
        DEL_LOCATION_ID     : String(10)  @title: 'DEL_LOCATION_ID: DEL_LOCATION_ID';
        DEL_LOCATION_NAME   : String(100) @title: 'DEL_LOCATION_NAME: DEL_LOCATION_NAME';
        DEL_ADDRESS1        : String(50)  @title: 'DEL_ADDRESS1: DEL_ADDRESS1';
        DEL_ADDRESS2        : String(50)  @title: 'DEL_ADDRESS2: DEL_ADDRESS2';
        DEL_CITY            : String(50)  @title: 'DEL_CITY: DEL_CITY';
        DEL_PROVINCE        : String(2)   @title: 'DEL_PROVINCE: DEL_PROVINCE';
        DEL_POSTAL_CODE     : String(6)   @title: 'DEL_POSTAL_CODE: DEL_POSTAL_CODE';
        DEL_PHONE_NUMBER    : String(10)  @title: 'DEL_PHONE_NUMBER: DEL_PHONE_NUMBER';
        B_STATUS            : String(2)   @title: 'B_STATUS: B_STATUS';
        TIRESIZE            : String(40)  @title: 'TIRESIZE: TIRESIZE';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGSTATUS {
        PROGRAM_UUID  : String(36) @title: 'PROGRAM_UUID: PROGRAM UUID';
        DEALER_CODE   : String(20) @title: 'DEALER_CODE: DEALER CODE';
        DEALER_CODE_S : String(6)  @title: 'DEALER_CODE_S: DEALER CODE - TCI SHORT';
        B_STATUS      : String(2)  @title: 'B_STATUS: BOOKING STATUS';
        CREATED_BY    : String(36) @title: 'CREATED_BY: CREATED BY';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGSTATUSSUMMARYVIEW( IN_DEALER_CODE : String(20), IN_PROGRAM_UUID : String(36), IN_LANG : String(2)) {
        DEALER_CODE      : String(20)  @title: 'DEALER_CODE: DEALER_CODE';
        PROGRAM_UUID     : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        B_STATUS         : String(2)   @title: 'B_STATUS: BOOKING STATUS';
        PROGRAM_ID       : String(40)  @title: 'PROGRAM_ID: PROGRAM ID';
        LANGUAGE_KEY     : String(2)   @title: 'LANGUAGE_KEY: LANGUAGE KEY';
        PROGRAM_DESC     : String(100) @title: 'PROGRAM_DESC: DESCRIPTION/NAME';
        DEPART           : String(4)   @title: 'DEPART: DEPARTMENT';
        BRAND            : String(2)   @title: 'BRAND: BRAND';
        OPEN_DATE        : Date        @title: 'OPEN_DATE: BOOKING WINDOW OPEN';
        CLOSE_DATE       : Date        @title: 'CLOSE_DATE: BOOKING WINDOW CLOSE';
        DELIVERY_FR      : Date        @title: 'DELIVERY_FR: DELIVERY WINDOW FROM';
        DELIVERY_TO      : Date        @title: 'DELIVERY_TO: DELIVERY WINDOW TO';
        STATUS           : String(10)  @title: 'STATUS: STATUS';
        INITIAL_WARN     : Decimal(2)  @title: 'INITIAL_WARN: INITIAL WARNING';
        FINAL_WARN       : Decimal(2)  @title: 'FINAL_WARN: FINAL WARNING';
        CPROGRAM_UUID    : String(36)  @title: 'CPROGRAM_UUID: COMPARATIVE PROGRAM UUID';
        AUDIT_CHANGED_BY : String(36)  @title: 'AUDIT_CHANGED_BY: CHANGED BY';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity DEALERBOOKINGVENDORREPORTCALCULATION(PROGRAMUID : String(36), VENDORCODE : String(20), LANGUAGE : String(2)) {
        PROGRAM_UUID        : String(36)  @title: 'PROGRAM_UUID: PROGRAM_UUID';
        PROGRAM_ID          : String(40)  @title: 'PROGRAM_ID: PROGRAM_ID';
        STATUS              : String(10)  @title: 'STATUS: STATUS';
        VENDOR_ID           : String(20)  @title: 'VENDOR_ID: VENDOR_ID';
        VENDOR_DESC         : String(100) @title: 'VENDOR_DESC: VENDOR_DESC';
        DEALER_CODE         : String(20)  @title: 'DEALER_CODE: DEALER_CODE';
        DEALER_NAME         : String(100) @title: 'DEALER_NAME: DEALER_NAME';
        DEALER_CODE_S       : String(6)   @title: 'DEALER_CODE_S: DEALER_CODE_S';
        CATEGORY_ID         : String(18)  @title: 'CATEGORY_ID: CATEGORY_ID';
        CATEGORY_DESC       : String(100) @title: 'CATEGORY_DESC: CATEGORY_DESC';
        PART_NUM            : String(40)  @title: 'PART_NUM: PART_NUM';
        PART_DESC           : String(100) @title: 'PART_DESC: PART_DESC';
        DETAIL              : String(255) @title: 'DETAIL: DETAIL';
        MMYYYY              : String(6)   @title: 'MMYYYY: MMYYYY';
        ORDER_QTY           : Decimal(13) @title: 'ORDER_QTY: ORDER_QTY';
        SCHEDULE_DATE       : Date        @title: 'SCHEDULE_DATE: SCHEDULE_DATE';
        DEL_METHOD          : String(20)  @title: 'DEL_METHOD: DEL_METHOD';
        DEL_METHOD_NAME     : String(100) @title: 'DEL_METHOD_NAME: DEL_METHOD_NAME';
        SPECIAL_INSTRUCTION : String(250) @title: 'SPECIAL_INSTRUCTION: SPECIAL_INSTRUCTION';
        DEL_LOCATION_ID     : String(10)  @title: 'DEL_LOCATION_ID: DEL_LOCATION_ID';
        DEL_LOCATION_NAME   : String(100) @title: 'DEL_LOCATION_NAME: DEL_LOCATION_NAME';
        DEL_ADDRESS1        : String(50)  @title: 'DEL_ADDRESS1: DEL_ADDRESS1';
        DEL_ADDRESS2        : String(50)  @title: 'DEL_ADDRESS2: DEL_ADDRESS2';
        DEL_CITY            : String(50)  @title: 'DEL_CITY: DEL_CITY';
        DEL_PROVINCE        : String(2)   @title: 'DEL_PROVINCE: DEL_PROVINCE';
        DEL_POSTAL_CODE     : String(6)   @title: 'DEL_POSTAL_CODE: DEL_POSTAL_CODE';
        DEL_PHONE_NUMBER    : String(10)  @title: 'DEL_PHONE_NUMBER: DEL_PHONE_NUMBER';
        B_STATUS            : String(2)   @title: 'B_STATUS: B_STATUS';
        TIRESIZE            : String(40)  @title: 'TIRESIZE: TIRESIZE';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMCATEGORYCALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY     : String(36)  @title: 'OBJECT_KEY: OBJECT KEY';
        PROGRAM_UUID   : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        CATEGORY_ID    : String(18)  @title: 'CATEGORY_ID: CATEGORY ID';
        CATEGORY_DESC  : String(100) @title: 'CATEGORY_DESC: CATEGORY DESCRIPTION/NAME';
        VALID          : String(1)   @title: 'VALID: IS VALID';
        DONOTTRANSPORT : String(1)   @title: 'DONOTTRANSPORT: DONOTTRANSPORT';
        LANGUAGE_KEY   : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED       : String(1)   @title: 'SELECTED';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMDELIVERYLOCATIONCALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY        : String(36)  @title: 'OBJECT_KEY: OBJECT KEY/ DELIVERY LOCATION UUID';
        PROGRAM_UUID      : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        VENDOR_ID         : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER/ID';
        VALID             : String(1)   @title: 'VALID: IS VALID';
        DEL_LOCATION_ID   : String(10)  @title: 'DEL_LOCATION_ID: DELIVERY LOCATION ID';
        DEL_LOCATION_NAME : String(100) @title: 'DEL_LOCATION_NAME: DELIVERY LOCATION DESCRIPTION/NAME';
        DEL_PHONE_NUMBER  : String(10)  @title: 'DEL_PHONE_NUMBER: PHONE NUMBER';
        DEL_ADDRESS1      : String(50)  @title: 'DEL_ADDRESS1: ADDRESS 1';
        DEL_ADDRESS2      : String(50)  @title: 'DEL_ADDRESS2: ADDRESS 2';
        DEL_CITY          : String(50)  @title: 'DEL_CITY: CITY';
        DEL_PROVINCE      : String(2)   @title: 'DEL_PROVINCE: PROVINCE';
        DEL_POSTAL_CODE   : String(6)   @title: 'DEL_POSTAL_CODE: POSTAL CODE';
        LANGUAGE_KEY      : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED          : String(1)   @title: 'SELECTED';
}

//

@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMDELIVERYMETHODCALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY      : String(36)  @title: 'OBJECT_KEY: OBJECT KEY';
        PROGRAM_UUID    : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        VENDOR_ID       : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER/ID';
        VENDOR_DESC     : String(100) @title: 'VENDOR_DESC: CATEGORY DESCRIPTION/NAME';
        CATEGORY_ID     : String(18)  @title: 'CATEGORY_ID: CATEGORY ID';
        CATEGORY_DESC   : String(100) @title: 'CATEGORY_DESC: CATEGORY DESCRIPTION/NAME';
        DEL_METHOD      : String(20)  @title: 'DEL_METHOD: DELIVERY METHOD ID';
        DEL_METHOD_NAME : String(100) @title: 'DEL_METHOD_NAME: DELIVERY METHOD DESCRIPTION/NAME';
        VALID           : String(1)   @title: 'VALID: IS VALID';
        DONOTTRANSPORT  : String(1)   @title: 'DONOTTRANSPORT: DONOTTRANSPORT';
        LANGUAGE_KEY    : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED        : String(1)   @title: 'SELECTED';
}
//

@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMPARTFITMENTCALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY   : String(36)  @title: 'OBJECT_KEY: OBJECT KEY';
        PROGRAM_UUID : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        VALID        : String(1)   @title: 'VALID: IS VALID';
        DETAIL       : String(255) @title: 'DETAIL: DETAIL INFORMATION';
        BRAND        : String(2)   @title: 'BRAND: BRAND';
        BRAND_NAME   : String(10)  @title: 'BRAND_NAME: BRAND NAME';
        MODEL_CODE   : String(7)   @title: 'MODEL_CODE: VEHICLE - TOYOTA MODEL CODE';
        MODEL_DESC   : String(100) @title: 'MODEL_DESC: VEHICLE MODEL DESCRIPTION/NAME';
        YEAR         : String(4)   @title: 'YEAR: VEHICLE - TOYOTA MODEL YEAR';
        SERIES_CODE  : String(3)   @title: 'SERIES_CODE: SERIES_CODE';
        SERIES_DESC  : String(100) @title: 'SERIES_DESC: SERIES_DESC';
        PART_NUM     : String(40)  @title: 'PART_NUM: PART_NUM';
        PART_DESC    : String(100) @title: 'PART_DESC: PART_DESC';
        LANGUAGE_KEY : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED     : String(1)   @title: 'SELECTED';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMPRIORPURCHASECALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY      : String(36)  @title: 'OBJECT_KEY: OBJECT KEY';
        PROGRAM_UUID    : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        VALID           : String(1)   @title: 'VALID: IS VALID';
        DEALER_CODE     : String(20)  @title: 'DEALER_CODE: DEALER CODE';
        DEALER_CODE_S   : String(6)   @title: 'DEALER_CODE_S: DEALER CODE - TCI SHORT';
        DEALER_DESC     : String(100) @title: 'DEALER_DESC: CATEGORY DESCRIPTION/NAME';
        PART_NUM        : String(40)  @title: 'PART_NUM: PART NUMBER';
        PART_DESC       : String(100) @title: 'PART_DESC: PART DESCRIPTION/NAME';
        PRIOR_PURCHASES : Decimal(13) @title: 'PRIOR_PURCHASES: PRIOR PURCHASE';
        LANGUAGE_KEY    : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED        : String(1)   @title: 'SELECTED';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMVENDORCALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY   : String(36)  @title: 'OBJECT_KEY: OBJECT KEY';
        PROGRAM_UUID : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        VALID        : String(1)   @title: 'VALID: IS VALID';
        VENDOR_ID    : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER';
        VENDOR_DESC  : String(100) @title: 'VENDOR_DESC: CATEGORY DESCRIPTION/NAME';
        DISTRIBUTOR  : String(1)   @title: 'DISTRIBUTOR: DISTRIBUTOR YES X OR NO';
        LANGUAGE_KEY : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED     : String(1)   @title: 'SELECTED';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity PROGRAMPERIODSMETA(IN_PROGRAM_UUID : String(36)) {
        PROGRAM_UUID : String(36) @title: 'PROGRAM_UUID: PROGRAM_UUID';
        F0_PERIOD    : String(6)  @title: 'F0_PERIOD: F0_PERIOD';
        F0_ENABLED   : String(1)  @title: 'F0_ENABLED: F0_ENABLED';
        F1_PERIOD    : String(6)  @title: 'F1_PERIOD: F1_PERIOD';
        F1_ENABLED   : String(1)  @title: 'F1_ENABLED: F1_ENABLED';
        F2_PERIOD    : String(6)  @title: 'F2_PERIOD: F2_PERIOD';
        F2_ENABLED   : String(1)  @title: 'F2_ENABLED: F2_ENABLED';
        F3_PERIOD    : String(6)  @title: 'F3_PERIOD: F3_PERIOD';
        F3_ENABLED   : String(1)  @title: 'F3_ENABLED: F3_ENABLED';
        F4_PERIOD    : String(6)  @title: 'F4_PERIOD: F4_PERIOD';
        F4_ENABLED   : String(1)  @title: 'F4_ENABLED: F4_ENABLED';
        F5_PERIOD    : String(6)  @title: 'F5_PERIOD: F5_PERIOD';
        F5_ENABLED   : String(1)  @title: 'F5_ENABLED: F5_ENABLED';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity MINIPROGRAMPARTSCALVIEW(PROGRAMUID : String(36), LANGUAGE : String(2)) {
        OBJECT_KEY     : String(36)  @title: 'OBJECT_KEY: OBJECT KEY';
        PROGRAM_UUID   : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        VALID          : String(1)   @title: 'VALID: IS VALID';
        PART_NUM       : String(40)  @title: 'PART_NUM: PART NUMBER';
        PART_DESC      : String(100) @title: 'PART_DESC: PART DESCRIPTION/NAME';
        CATEGORY_ID    : String(18)  @title: 'CATEGORY_ID: CATEGORY ID';
        CATEGORY_DESC  : String(100) @title: 'CATEGORY_DESC: CATEGORY DESCRIPTION/NAME';
        VENDOR_ID      : String(20)  @title: 'VENDOR_ID: VENDOR NUMBER/ID';
        VENDOR_DESC    : String(100) @title: 'VENDOR_DESC: CATEGORY DESCRIPTION/NAME';
        DETAIL         : String(255) @title: 'DETAIL: DETAIL INFORMATION';
        DONOTTRANSPORT : String(1)   @title: 'DONOTTRANSPORT: DONOTTRANSPORT';
        TIRESIZE       : String(40)  @title: 'TIRESIZE: TIRE SIZE';
        SPEEDRATING    : String(1)   @title: 'SPEEDRATING: SPEED RATING';
        LOADRATING     : String(3)   @title: 'LOADRATING: LOAD RATING';
        DEALERNET      : String(40)  @title: 'DEALERNET: DEALER NET';
        LANGUAGE_KEY   : String(2)   @title: 'LANGUAGE_KEY';
        SELECTED       : String(1)   @title: 'SELECTED';
}

//
@cds.persistence.exists
@cds.persistence.calcview
entity PROGRAMSEARCH(IN_LANG : String(2), IN_STATUS : String(2) default 'AL', IN_DEPART : String(4) default 'ALAL', IN_X_STATUS : String, IN_BRAND : String(2) default 'AL', IN_PNUM : String(36)) {
        PROGRAM_UUID : String(36)  @title: 'PROGRAM_UUID: PROGRAM UUID';
        PROGRAM_ID   : String(40)  @title: 'PROGRAM_ID: PROGRAM ID';
        STATUS       : String(2)   @title: 'STATUS: C_STATUS';
        STATUS_DESC  : String(20)  @title: 'STATUS_DESC: STATUS DESCRIPTION/NAME';
        LANGUAGE_KEY : String(2)   @title: 'LANGUAGE_KEY: LANGUAGE KEY';
        PROGRAM_DESC : String(100) @title: 'PROGRAM_DESC: DESCRIPTION/NAME';
        DEPART       : String(4)   @title: 'DEPART: DEPARTMENT';
        DEPART_NAME  : String(100) @title: 'DEPART_NAME: DEPARTMENT DESCRIPTION/NAME';
        BRAND        : String(2)   @title: 'BRAND: BRAND';
        OPEN_DATE    : Date        @title: 'OPEN_DATE: BOOKING WINDOW OPEN';
        CLOSE_DATE   : Date        @title: 'CLOSE_DATE: BOOKING WINDOW CLOSE';
        INITIAL_WARN : Decimal(2)  @title: 'INITIAL_WARN: INITIAL WARNING';
        FINAL_WARN   : Decimal(2)  @title: 'FINAL_WARN: FINAL WARNING';
        DELIVERY_FR  : Date        @title: 'DELIVERY_FR: DELIVERY WINDOW FROM';
        DELIVERY_TO  : Date        @title: 'DELIVERY_TO: DELIVERY WINDOW TO';
}

//
@cds.persistence.exists
entity PROGRAMSTATUSCALCULATION(PROGRAMUID : String(36)) {
        PROGRAM_UUID  : String(36) @title: 'PROGRAM_UUID: PROGRAM UUID';
        PROGRAM_ID    : String(40) @title: 'PROGRAM_ID: PROGRAM ID';
        DEPART        : String(4)  @title: 'DEPART: DEPARTMENT';
        BRAND         : String(2)  @title: 'BRAND: BRAND';
        OPEN_DATE     : Date       @title: 'OPEN_DATE: BOOKING WINDOW OPEN';
        CLOSE_DATE    : Date       @title: 'CLOSE_DATE: BOOKING WINDOW CLOSE';
        INITIAL_WARN  : Decimal(2) @title: 'INITIAL_WARN: INITIAL WARNING';
        FINAL_WARN    : Decimal(2) @title: 'FINAL_WARN: FINAL WARNING';
        DELIVERY_FR   : Date       @title: 'DELIVERY_FR: DELIVERY WINDOW FROM';
        DELIVERY_TO   : Date       @title: 'DELIVERY_TO: DELIVERY WINDOW TO';
        STATUS        : String(10) @title: 'STATUS: STATUS';
        CPROGRAM_UUID : String(36) @title: 'CPROGRAM_UUID: COMPARATIVE PROGRAM UUID';
        DEALER_CODE   : String(20) @title: 'DEALER_CODE: DEALER CODE';
        B_STATUS      : String(2)  @title: 'B_STATUS: BOOKING STATUS';
        C_STATUS      : String(10) @title: 'C_STATUS';
}
