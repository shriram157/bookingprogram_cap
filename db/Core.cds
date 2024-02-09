context Core {
    type PROGRAM_ID_T : String(40);
    type CATEGORY_ID_T : String(18);
    type VENDOR_ID_T : String(20);
    type DEL_METHOD_ID_T : String(20);
    type DEL_LOCATION_ID_T : String(10);
    type DEALER_CODE_T : String(20);
    type DEALER_CODE_S_T : String(6); // short version
    type DEPART_CODE_T : String(4);
    type BRAND_T : String(2);
    type BOOKING_ID_T : String(36); // UUID
    type DELIVERY_ID_T : String(36); //UUID
    type OBJECT_UID_T : String(36); //UUID
    type LANGUAGE_KEY_T : String(2);
    type PART_NUM_T : String(40);
    type B_STATUS_T : String(2);
    type P_STATUS_T : String(10);
    type STATUS_DESC_T : String(20);
    type DESCRIPTION_T : String(100);
    type USER_NAME_T : String(36); // could be ID, email or UUID
    type YES_NO_T : String(1);
    type FONT_NUM_T : String(10);
    type ERROR_CODE_T : String(8);
    type ERROR_TYPE_T : String(1);
    type MODEL_CODE_T : String(7);
    type TIRESIZE_T    : String(40);
    type SPEEDRATING_T    : String(1);
    type LOADRATING_T    : String(3);
    type DEALERNET_T    : String(40);
    
    type ADDRESS_T {
        @title : 'Address 1'
        DEL_ADDRESS1    : String(50);

        @title : 'Address 2'
        DEL_ADDRESS2    : String(50);

        @title : 'City'
        DEL_CITY        : String(50);

        @title : 'Province'
        DEL_PROVINCE    : String(2);

        @title : 'Postal Code'
        DEL_POSTAL_CODE : String(6);
    };
    
    type AUDIT_T {
        @title : 'Created On'
        CREATED_ON : DateTime;

        @title : 'Created By'
        CREATED_BY : USER_NAME_T;

        @title : 'Changed On'
        CHANGED_ON : DateTime;

        @title : 'Changed By'
        CHANGED_BY : USER_NAME_T;
    };

    type AUDIT {
        @title : 'Created On'
        CREATED_ON : String;

        @title : 'Created By'
        CREATED_BY : USER_NAME_T;

        @title : 'Changed On'
        CHANGED_ON : String;

        @title : 'Changed By'
        CHANGED_BY : USER_NAME_T;
    };

    

   
    @title : 'Department Name'
    entity DEPART_NAME {
            @title : 'Department Code'
        key DEPART_CODE     : DEPART_CODE_T;

            @title : 'Language Key'
        key LANGUAGE_KEY    : LANGUAGE_KEY_T;

            @title : 'External Department Code'
            DEPART_CODE_EXT : DESCRIPTION_T;

            @title : 'Department Description/Name'
            DEPART_NAME     : DESCRIPTION_T;
            
            AUDIT           : AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Booking Status Name'
    entity BOOKING_STATUS {
            @title : 'Booking Status'
        key B_STATUS     : B_STATUS_T;

            @title : 'Language Key'
        key LANGUAGE_KEY : LANGUAGE_KEY_T;

            @title : 'Status Description/Name'
            STATUS_DESC  : STATUS_DESC_T;
            
            AUDIT        : AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Status Description'
    entity PROGRAM_STATUS {
            @title : 'Status'
        key P_STATUS     : P_STATUS_T;

            @title : 'Language Key'
        key LANGUAGE_KEY : LANGUAGE_KEY_T;

            @title : 'Status Description/Name'
            STATUS_DESC  : STATUS_DESC_T;
            
            AUDIT        : AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };
    
    
    @title : 'Error Code Table, with Language'
    entity ERROR_CODE {
            @title : 'Error Code'
        key ERROR_CODE   : ERROR_CODE_T;

            @title : 'Language Key'
        key LANGUAGE_KEY : LANGUAGE_KEY_T;

            @title : 'Error Type'
        	ERROR_TYPE   : ERROR_TYPE_T;

            @title : 'Error Description/Name'
            ERROR_DESC   : String(255);
    }
    // technical configuration {
    //     column store;
    // };

    
    @title : 'Object to message relational table '
    entity OBJECT_MESSAGE {
            @title : 'Object Key'
        key OBJECT_KEY   : OBJECT_UID_T;

            @title : 'Error Code'
        key ERROR_CODE   : ERROR_CODE_T;

            AUDIT        : AUDIT_T;
    }
    // technical configuration {
    //     column store;
    // };

};