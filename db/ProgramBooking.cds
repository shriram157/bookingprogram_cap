using Core from './Core'; // replaced "EM" with "Core"
using ProgramAdmin from './BookingAdmin'; // replaced PA with ProgramAdmin


@cds.autoexpose
context ProgramBooking {
    type PROCEDURES_TT_ERRORS {
        HTTP_STATUS_CODE : Integer;
        ERROR_MESSAGE    : String(100);
        DETAIL           : String(100);
    };

    define view bookingStatusView as
        select from Core.BOOKING_STATUS {
            B_STATUS     as STATUS,
            LANGUAGE_KEY as LANG,
            STATUS_DESC  as DESC
        };

    define view dealerBookingCountView as
        select from DEALER_BOOKING {
            PROGRAM_UUID as PROGRAM_UUID,
            DEALER_CODE  as DEALER_CODE,
            count( * )   as count
        }
        group by
            PROGRAM_UUID,
            DEALER_CODE;

    define view dealerBookingLatestStatusTimeView as
        select from DEALER_BOOKING_STATUS_HIST {
            PROGRAM_UUID as PROGRAM_UUID,
            DEALER_CODE  as DEALER_CODE,
            B_STATUS     as B_STATUS,
            max(
                AUDIT.CREATED_ON
            )            as LAST_CREATED_ON
        }
        group by
            PROGRAM_UUID,
            DEALER_CODE,
            B_STATUS;

    define view partsScheduleDeliveryView as
        select from (
            DEALER_BOOKING_PERIOD as A
            left outer join DELIVERY_SCHEDULE_LINE as B
                on  A.PROGRAM_UUID = B.PROGRAM_UUID
                and A.DEALER_CODE  = B.DEALER_CODE
                and A.VENDOR_ID    = B.VENDOR_ID
                and A.CATEGORY_ID  = B.CATEGORY_ID
                and A.MMYYYY       = B.MMYYYY
            left outer join DEALER_BOOKING as C
                on  A.PROGRAM_UUID = C.PROGRAM_UUID
                and A.DEALER_CODE  = C.DEALER_CODE
                and A.VENDOR_ID    = C.VENDOR_ID
                and A.PART_NUM     = C.PART_NUM
        ) {
                C.B_STATUS      as B_STATUS,
            key A.PROGRAM_UUID  as PROGRAM_UUID,
            key A.DEALER_CODE   as DEALER_CODE,
            key A.VENDOR_ID     as VENDOR_ID,
            key A.CATEGORY_ID   as CATEGORY_ID,
            key A.PART_NUM      as PART_NUM,
            key A.MMYYYY        as MMYYYY,
                A.PERIOD_DT     as PERIOD_DT,
                A.ORDER_QTY     as ORDER_QTY,
                B.SCHEDULE_DATE as SCHEDULE_DATE
        }
        where
            ORDER_QTY > 0
        order by
            B_STATUS,
            PROGRAM_UUID,
            DEALER_CODE,
            VENDOR_ID,
            CATEGORY_ID,
            PART_NUM,
            PERIOD_DT;

    define view dealerBookingPropertyView as
        select from DEALER_BOOKING {
            PROGRAM_UUID     as PROGRAM_UUID,
            DEALER_CODE      as DEALER_CODE,
            PART_NUM         as PART_NUM,
            VENDOR_ID        as VENDOR_ID,
            CATEGORY_ID      as CATEGORY_ID,
            DEALER_NET       as DEALER_NET,
            PRIOR_PURCHASES  as PRIOR_PURCHASES,
            PRIOR_BOOKING    as PRIOR_BOOKING,
            AUDIT.CHANGED_BY as CHANGED_BY
        };

    define view dealerBookingPeriodKeyView as
        select from DEALER_BOOKING_PERIOD {
            PROGRAM_UUID as PROGRAM_UUID,
            DEALER_CODE  as DEALER_CODE,
            PART_NUM     as PART_NUM,
            VENDOR_ID    as VENDOR_ID,
            CATEGORY_ID  as CATEGORY_ID,
            count( * )   as count
        }
        group by
            PROGRAM_UUID,
            DEALER_CODE,
            PART_NUM,
            VENDOR_ID,
            CATEGORY_ID;

    define view dealerBookingPeriodView as
        select from DEALER_BOOKING_PERIOD as A
        left outer join ProgramAdmin.DEALER_INFO as B
            on A.DEALER_CODE = B.DEALER_CODE
        {
            A.PROGRAM_UUID     as PROGRAM_UUID,
            A.DEALER_CODE      as DEALER_CODE,
            B.DEALER_CODE_S    as DEALER_CODE_S,
            B.DEALER_NAME      as DEALER_NAME,
            A.PART_NUM         as PART_NUM,
            A.VENDOR_ID        as VENDOR_ID,
            A.CATEGORY_ID      as CATEGORY_ID,
            A.MMYYYY           as MMYYYY,
            A.PERIOD_DT        as PERIOD_DT,
            A.ORDER_QTY        as ORDER_QTY,
            A.AUDIT.CHANGED_BY as CHANGED_BY
        };

    define view dealerDeliveryView as
        select from DELIVERY_SCHEDULE {
            PROGRAM_UUID        as PROGRAM_UUID,
            DEALER_CODE         as DEALER_CODE,
            VENDOR_ID           as VENDOR_ID,
            CATEGORY_ID         as CATEGORY_ID,            DEL_METHOD          as DEL_METHOD,
            DEL_LOCATION_UUID   as DEL_LOCATION_UUID,
            SPECIAL_INSTRUCTION as SPECIAL_INSTRUCTION,
            AUDIT.CHANGED_BY    as CHANGED_BY
        };

    define view dealerDeliveryPeriodView as
        select from DELIVERY_SCHEDULE_LINE {
            PROGRAM_UUID     as PROGRAM_UUID,
            DEALER_CODE      as DEALER_CODE,
            VENDOR_ID        as VENDOR_ID,
            CATEGORY_ID      as CATEGORY_ID,
            MMYYYY           as MMYYYY,
            PERIOD_DT        as PERIOD_DT,
            SCHEDULE_DATE    as SCHEDULE_DATE,
            AUDIT.CHANGED_BY as CHANGED_BY
        };


    @title: 'Dealer Booking Status History'
    entity DEALER_BOOKING_STATUS_HIST {
            @title: 'Object Key'
        key OBJECT_KEY   : Core.OBJECT_UID_T;

            @title: 'Program UUID'
            PROGRAM_UUID : Core.OBJECT_UID_T not null;

            @title: 'Dealer Code'
            DEALER_CODE  : Core.VENDOR_ID_T not null;

            @title: 'Booking Status'
            B_STATUS     : Core.B_STATUS_T;

            AUDIT        : Core.AUDIT_T;
    };


    @title: 'Dealer Booking'
    entity DEALER_BOOKING {
            @title: 'Program UUID'
        key PROGRAM_UUID    : Core.OBJECT_UID_T;

            @title: 'Dealer Code'
        key DEALER_CODE     : Core.VENDOR_ID_T;

            @title: 'Part Number'
        key PART_NUM        : Core.PART_NUM_T;

            @title: 'Vendor Number'
        key VENDOR_ID       : Core.VENDOR_ID_T;

            @title: 'Category'
            CATEGORY_ID     : Core.CATEGORY_ID_T not null;

            @title: 'Prior booking'
            DEALER_NET      : Decimal(13, 0);

            @title: 'Prior Purchase'
            PRIOR_PURCHASES : Decimal(13, 0);

            @title: 'Prior booking'
            PRIOR_BOOKING   : Decimal(13, 0);

            @title: 'Booking Status'
            B_STATUS        : Core.B_STATUS_T;

            AUDIT           : Core.AUDIT_T;

            toLines         : Association[1, 0.. * ] to DEALER_BOOKING_PERIOD
                                  on  toLines.PROGRAM_UUID = PROGRAM_UUID
                                  and toLines.DEALER_CODE  = DEALER_CODE
                                  and toLines.PART_NUM     = PART_NUM
                                  and toLines.VENDOR_ID    = VENDOR_ID;

    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Dealer Booking deliery Period Data Table'
    entity DEALER_BOOKING_PERIOD {
            @title: 'Program UUID'
        key PROGRAM_UUID : Core.OBJECT_UID_T;

            @title: 'Dealer Code'
        key DEALER_CODE  : Core.DEALER_CODE_T;

            @title: 'Part Number'
        key PART_NUM     : Core.PART_NUM_T;

            @title: 'Vendor Number'
        key VENDOR_ID    : Core.VENDOR_ID_T;

            @title: 'MMYYYY'
        key MMYYYY       : String(6);

            @title: 'value for sorting '
            PERIOD_DT    : Date not null;

            @title: 'Category atributes'
            CATEGORY_ID  : Core.CATEGORY_ID_T not null;

            @title: 'order quantity'
            ORDER_QTY    : Decimal(13, 0);

            AUDIT        : Core.AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Delivery Schedule'
    entity DELIVERY_SCHEDULE {
            @title: 'Program UUID'
        key PROGRAM_UUID        : Core.OBJECT_UID_T;

            @title: 'Dealer Code'
        key DEALER_CODE         : Core.VENDOR_ID_T;

            @title: 'Vendor Number'
        key VENDOR_ID           : Core.VENDOR_ID_T;

            @title: 'Category'
        key CATEGORY_ID         : Core.CATEGORY_ID_T;

            @title: 'Delivery Method ID - FK'
            DEL_METHOD          : Core.DEL_METHOD_ID_T;

            @title: 'DEL_LOCATION_UUID -FK'
            DEL_LOCATION_UUID   : Core.OBJECT_UID_T;

            @title: 'Vendor Number'
            SPECIAL_INSTRUCTION : String(250);

            @title: 'Booking Status'
            B_STATUS            : Core.B_STATUS_T;

            AUDIT               : Core.AUDIT_T;

            toLines             : Association[1, 0.. * ] to DELIVERY_SCHEDULE_LINE
                                      on  toLines.PROGRAM_UUID = PROGRAM_UUID
                                      and toLines.DEALER_CODE  = DEALER_CODE
                                      and toLines.VENDOR_ID    = VENDOR_ID
                                      and toLines.CATEGORY_ID  = CATEGORY_ID;
    }
    // technical configuration {
    //     column store;
    // };


    @title: 'Dealer Booking lines'
    entity DELIVERY_SCHEDULE_LINE {
            @title: 'Program UUID'
        key PROGRAM_UUID  : Core.OBJECT_UID_T;

            @title: 'Dealer Code'
        key DEALER_CODE   : Core.VENDOR_ID_T;

            @title: 'Vendor Number'
        key VENDOR_ID     : Core.VENDOR_ID_T;

            @title: 'Category'
        key CATEGORY_ID   : Core.CATEGORY_ID_T;

            @title: 'MMYYYY'
        key MMYYYY        : String(6);

            @title: 'Sequence Counter, aka a line number, may be has no use'
            COUNTER       : Integer;

            @title: 'value for sorting '
            PERIOD_DT     : Date not null;

            @title: 'schedule date, most like sort on date'
            SCHEDULE_DATE : Date;

            AUDIT         : Core.AUDIT_T;
    }
// technical configuration {
//     column store;
// };

};
