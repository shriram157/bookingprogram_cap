const cds = require('@sap/cds');
module.exports = async (srv) => {

    // Call Hana Procedure 'PROCEDURES_BOOKINGPROGRAMSTATUSCREATE'
    //Done
    srv.on('bookingProgramStatusCreate', async (req) => {
        try {
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let DEALER_CODE = req.data.DEALER_CODE;
            let DEALER_CODE_S = req.data.DEALER_CODE_S;
            let B_STATUS = req.data.B_STATUS;
            let CREATED_BY = req.data.CREATED_BY;
            let details = {
                "DEALER_CODE": DEALER_CODE,
                "DEALER_CODE_S": DEALER_CODE_S,
                "CREATED_BY": CREATED_BY,
                "B_STATUS": B_STATUS,
                "PROGRAM_UUID": PROGRAM_UUID
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            //console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { bookingProgramStatus_Table } = cds.entities("ProgramAdmin");
            //console.log(bookingProgramSummary_Table);
            let rs1 = await db.run(DELETE.from(bookingProgramStatus_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(bookingProgramStatus_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_BOOKINGPROGRAMSTATUSCREATE"( IM_DETAILS => PROGRAMADMIN_BOOKINGPROGRAMSTATUS_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);

            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Call Hana Procedure 'PROCEDURES_DEALERBOOKINGPERIODCREATE'
    //Done
    srv.on('dealerBookingPeriodCreate', async (req) => {
        try {
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let DEALER_CODE = req.data.DEALER_CODE;
            let DEALER_CODE_S = req.data.DEALER_CODE_S;
            let DEALER_NAME = req.data.DEALER_NAME;
            let PART_NUM = req.data.PART_NUM;
            let VENDOR_ID = req.data.VENDOR_ID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let MMYYYY = req.data.MMYYYY;
            let PERIOD_DT = req.data.PERIOD_DT;
            let ORDER_QTY = req.data.ORDER_QTY;
            let CHANGED_BY = req.data.CHANGED_BY;
            let details = {
                "DEALER_CODE": DEALER_CODE,
                "DEALER_CODE_S": DEALER_CODE_S,
                "DEALER_NAME": DEALER_NAME,
                "PART_NUM": PART_NUM,
                "VENDOR_ID": VENDOR_ID,
                "CATEGORY_ID": CATEGORY_ID,
                "MMYYYY": MMYYYY,
                "PERIOD_DT": PERIOD_DT,
                "ORDER_QTY": ORDER_QTY,
                "CHANGED_BY": CHANGED_BY,
                "PROGRAM_UUID": PROGRAM_UUID
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { dealerBookingPeriod_Table } = cds.entities("ProgramAdmin");
            //console.log(bookingProgramSummary_Table);
            let rs1 = await db.run(DELETE.from(dealerBookingPeriod_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(dealerBookingPeriod_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_DEALERBOOKINGPERIODCREATE"( IM_DETAILS => PROGRAMADMIN_DEALERBOOKINGPERIOD_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    //Calling Hana Procedure 'PROCEDURES_DEALERBOOKINGDELIVERYPERIODCREATE'
    //Done
    srv.on('dealerBookingDeliveryPeriodCreate', async (req) => {
        try {
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let DEALER_CODE = req.data.DEALER_CODE;
            let VENDOR_ID = req.data.VENDOR_ID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let MMYYYY = req.data.MMYYYY;
            let PERIOD_DT = req.data.PERIOD_DT;
            let SCHEDULE_DATE = req.data.SCHEDULE_DATE;
            let CHANGED_BY = req.data.CHANGED_BY;
            let details = {
                "PROGRAM_UUID": PROGRAM_UUID,
                "DEALER_CODE": DEALER_CODE,
                "VENDOR_ID": VENDOR_ID,
                "CATEGORY_ID": CATEGORY_ID,
                "MMYYYY": MMYYYY,
                "PERIOD_DT": PERIOD_DT,
                "SCHEDULE_DATE": SCHEDULE_DATE,
                "CHANGED_BY": CHANGED_BY,
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { DEALERBOOKINGDELIVERYPERIOD_TABLE } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(DEALERBOOKINGDELIVERYPERIOD_TABLE));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(DEALERBOOKINGDELIVERYPERIOD_TABLE).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_DEALERBOOKINGDELIVERYPERIODCREATE"( IM_DETAILS => PROGRAMADMIN_DEALERBOOKINGDELIVERYPERIOD_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
            //req.error(error);
        }
    });


    // Call Hana Procedure 'PROCEDURES_DEALERBOOKINGDELIVERYCREATE'
    // Done
    srv.on('dealerBookingDeliveryCreate', async (req) => {
        try {
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let DEALER_CODE = req.data.DEALER_CODE;
            let VENDOR_ID = req.data.VENDOR_ID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let DEL_METHOD = req.data.DEL_METHOD;
            let DEL_LOCATION_UUID = req.data.DEL_LOCATION_UUID;
            let SPECIAL_INSTRUCTION = req.data.SPECIAL_INSTRUCTION;
            let CHANGED_BY = req.data.CHANGED_BY;
            let details = {
                "PROGRAM_UUID": PROGRAM_UUID,
                "DEALER_CODE": DEALER_CODE,
                "VENDOR_ID": VENDOR_ID,
                "CATEGORY_ID": CATEGORY_ID,
                "DEL_METHOD": DEL_METHOD,
                "DEL_LOCATION_UUID": DEL_LOCATION_UUID,
                "SPECIAL_INSTRUCTION": SPECIAL_INSTRUCTION,
                "CHANGED_BY": CHANGED_BY,
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { dealerBookingDelivery_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(dealerBookingDelivery_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(dealerBookingDelivery_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_DEALERBOOKINGDELIVERYCREATE"( IM_DETAILS => PROGRAMADMIN_DEALERBOOKINGDELIVERY_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                //console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMCATEGORYCREATE'
    //Done
    srv.on('programCategoryCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let EN_DESC = req.data.EN_DESC;
            let FR_DESC = req.data.FR_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            let DONOTTRANSPORT = req.data.DONOTTRANSPORT;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "CATEGORY_ID": CATEGORY_ID,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_DESC": EN_DESC,
                "FR_DESC": FR_DESC,
                "CHANGED_BY": CHANGED_BY,
                "DONOTTRANSPORT": DONOTTRANSPORT
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programCategory_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programCategory_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programCategory_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYCREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMCATEGORY_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                return results.EX_ERROR[0];
                //req.reject(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
            }
            //return results;
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMCATEGORYUPDATE'
    srv.on('programCategoryUpdate', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            //let EN_DESC = req.data.EN_DESC;
            //let FR_DESC = req.data.FR_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            let DONOTTRANSPORT = req.data.DONOTTRANSPORT;
            let db = await cds.connect.to('db');
            const { programCategory_Table } = cds.entities("ProgramAdmin");
            const { programCategoryNew_Table } = cds.entities("ProgramAdmin");
            let res = await db.run(DELETE.from(programCategory_Table));
            let res1 = await db.run(DELETE.from(programCategoryNew_Table));
            const service = await cds.connect.to('BookingProgram');
            let { ProgramCategorySet } = service.entities;
            let tx = cds.transaction(req);
            let details1 = await tx.run(SELECT.from(ProgramCategorySet).where({ "OBJECT_KEY": OBJECT_KEY }));
            //Old Data Insertion
            let rs2 = await db.run(INSERT.into(programCategoryNew_Table).entries(details1));
            console.log(rs2);
            console.log("Details1");
            console.log(details1);
            let details = {
                "OBJECT_KEY": OBJECT_KEY,
                "PROGRAM_UUID": PROGRAM_UUID,
                "CATEGORY_ID": CATEGORY_ID,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_DESC": details1[0].EN_DESC,
                "FR_DESC": details1[0].FR_DESC,
                "CHANGED_BY": CHANGED_BY,
                "DONOTTRANSPORT": DONOTTRANSPORT

            };
            //New Data Insertion
            let rs = await db.run(INSERT.into(programCategory_Table).entries(details));

            //const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYUPDATE"( it_new => PROGRAMADMIN_PROGRAMCATEGORY_TABLE , it_old => PROGRAMADMIN_PROGRAMCATEGORYNEW_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [it_new, it_old])
            // const { O1 } = await cds.run(dbQuery)
            const results = await cds.run(dbQuery);
            console.log(results)
            // if (results.EX_ERROR[0] == null) {
            //     return details;
            // }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                //console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            return "Success";
        }
        catch (error) {
            console.log("Error Occured...");
            console.error(error)
            return req.error(results.EX_ERROR);
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMCATEGORYDELETE'
    srv.on('programCategoryDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programCategory_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programCategory_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramCategorySet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramCategorySet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programCategory_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMCATEGORY_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            else {
                return "Deleted..";
            }
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR);
            return;
        }
        
    });

    // Call Hana Procedure 'PROCEDURES_BOOKINGPROGRAMCREATE' 
    // Done
    srv.on('bookingProgramCreate', async (req) => {
        try {
            let BRAND = req.data.BRAND;
            let CHANGED_BY = req.data.CHANGED_BY;
            let CLOSE_DATE = req.data.CLOSE_DATE;
            let CPROGRAM_UUID = req.data.CPROGRAM_UUID;
            let DELIVERY_FR = req.data.DELIVERY_FR;
            let DELIVERY_TO = req.data.DELIVERY_TO;
            let DEPART = req.data.DEPART;
            let EN_DESC = req.data.EN_DESC;
            let FINAL_WARN = req.data.FINAL_WARN;
            let FR_DESC = req.data.FR_DESC;
            let INITIAL_WARN = req.data.INITIAL_WARN;
            let OPEN_DATE = req.data.OPEN_DATE;
            let PROGRAM_ID = req.data.PROGRAM_ID;
            let STATUS = req.data.STATUS;
            //let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let details = {
                "BRAND": BRAND,
                "CHANGED_BY": CHANGED_BY,
                "CLOSE_DATE": CLOSE_DATE,
                "CPROGRAM_UUID": CPROGRAM_UUID,
                "DELIVERY_FR": DELIVERY_FR,
                "DELIVERY_TO": DELIVERY_TO,
                "DEPART": DEPART,
                "EN_DESC": EN_DESC,
                "FINAL_WARN": FINAL_WARN,
                "FR_DESC": FR_DESC,
                "INITIAL_WARN": INITIAL_WARN,
                "OPEN_DATE": OPEN_DATE,
                "PROGRAM_ID": PROGRAM_ID,
                "STATUS": STATUS,
                "PROGRAM_UUID": cds.utils.uuid(),
                // "validFrom": Date(),
                // "validTo":''
            };
            let db = await cds.connect.to('db');
            const { bookingProgramSummary_Table } = cds.entities("ProgramAdmin");
            //console.log(bookingProgramSummary_Table);
            let rs1 = await db.run(DELETE.from(bookingProgramSummary_Table));
            //console.log(rs1);
            let rs = await db.run(INSERT.into(bookingProgramSummary_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_BOOKINGPROGRAMCREATE"( IM_DETAILS => PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR[0]);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            //req.reject(551, 'The Record already exist');
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    //pending
    // Call Hana Procedure 'PROCEDURES_BOOKINGPROGRAMUPDATE'
    srv.on('bookingProgramUpdate', async (req) => {
        try {
            console.log("BookingProgramUpdate");
            console.log(req.data);
            console.log(req.data.PROGRAM_UUID);
            //console.log(req.data.data1);
            let BRAND = req.data.BRAND;
            let CHANGED_BY = req.data.CHANGED_BY;
            let CLOSE_DATE = req.data.CLOSE_DATE;
            let CPROGRAM_UUID = req.data.CPROGRAM_UUID;
            let DELIVERY_FR = req.data.DELIVERY_FR;
            let DELIVERY_TO = req.data.DELIVERY_TO;
            let DEPART = req.data.DEPART;
            let EN_DESC = req.data.EN_DESC;
            let FINAL_WARN = req.data.FINAL_WARN;
            let FR_DESC = req.data.FR_DESC;
            let INITIAL_WARN = req.data.INITIAL_WARN;
            let OPEN_DATE = req.data.OPEN_DATE;
            let PROGRAM_ID = req.data.PROGRAM_ID;
            let STATUS = req.data.STATUS;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let details = {
                "BRAND": BRAND,
                "CHANGED_BY": CHANGED_BY,
                "CLOSE_DATE": CLOSE_DATE,
                "CPROGRAM_UUID": CPROGRAM_UUID,
                "DELIVERY_FR": DELIVERY_FR,
                "DELIVERY_TO": DELIVERY_TO,
                "DEPART": DEPART,
                "EN_DESC": EN_DESC,
                "FINAL_WARN": FINAL_WARN,
                "FR_DESC": FR_DESC,
                "INITIAL_WARN": INITIAL_WARN,
                "OPEN_DATE": OPEN_DATE,
                "PROGRAM_ID": PROGRAM_ID,
                "STATUS": STATUS,
                "PROGRAM_UUID": PROGRAM_UUID
                // "validFrom": Date(),
                // "validTo":''
            };
            let db = await cds.connect.to('db');
            const { bookingProgramSummary_Table } = cds.entities("ProgramAdmin");
            const { bookingProgramSummaryNew_Table } = cds.entities("ProgramAdmin");
            let res = await db.run(DELETE.from(bookingProgramSummary_Table));
            let res1 = await db.run(DELETE.from(bookingProgramSummaryNew_Table));
            let rs = await db.run(INSERT.into(bookingProgramSummary_Table).entries(details));
            //const { it_new } = { BRAND, CHANGED_BY, CLOSE_DATE, CPROGRAM_UUID, DELIVERY_FR, DELIVERY_TO, DEPART, EN_DESC, FINAL_WARN, FR_DESC, INITIAL_WARN, OPEN_DATE, PROGRAM_ID, STATUS };
            const service = await cds.connect.to('BookingProgram');
            const { BookingProgramSummary } = service.entities;
            let tx = cds.transaction(req);
            const details1 = await tx.run(SELECT.from(BookingProgramSummary).where({ "PROGRAM_UUID": PROGRAM_UUID }));
            console.log("Details1");
            console.log(details1);
            let rs2 = await db.run(INSERT.into(bookingProgramSummaryNew_Table).entries(details1));
            console.log(rs2);
            //const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_BOOKINGPROGRAMUPDATE"( it_new => PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TABLE , it_old => PROGRAMADMIN_BOOKINGPROGRAMSUMMARYNEW_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [it_new, it_old])
            // const { O1 } = await cds.run(dbQuery)
            const results = await cds.run(dbQuery);
            console.log(results)
            if (results.EX_ERROR[0] == null) {
                return "Success";
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }

            //return results;
        }
        catch (error) {
            console.error(error)
            return req.error;
        }
    });

    //pending
    // Call Hana Procedure 'PROCEDURES_BOOKINGPROGRAMDELETE'
    srv.on('bookingProgramDelete', async (req) => {
        try {
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            console.log(PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { bookingProgramSummary_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(bookingProgramSummary_Table));
            const service = await cds.connect.to('BookingProgram');
            const { BookingProgramSummary } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(BookingProgramSummary).where({ "PROGRAM_UUID": PROGRAM_UUID }));
            let rs = await db.run(INSERT.into(bookingProgramSummary_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_BOOKINGPROGRAMDELETE"( IM_DETAILS => PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
            //return results;
            return "Done";
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORCREATE'
    //Done
    srv.on('programVendorCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let VENDOR_ID = req.data.VENDOR_ID;
            let DISTRIBUTOR = req.data.DISTRIBUTOR;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let EN_DESC = req.data.EN_DESC;
            let FR_DESC = req.data.FR_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "VENDOR_ID": VENDOR_ID,
                "DISTRIBUTOR": DISTRIBUTOR,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_DESC": EN_DESC,
                "FR_DESC": FR_DESC,
                "CHANGED_BY": CHANGED_BY
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programVendor_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programVendor_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programVendor_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMVENDORCREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMVENDOR_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            //return results;
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORUPDATE'
    srv.on('programVendorUpdate', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let VENDOR_ID = req.data.VENDOR_ID;
            let DISTRIBUTOR = req.data.DISTRIBUTOR;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            //let EN_DESC = req.data.EN_DESC;
            //let FR_DESC = req.data.FR_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            console.log("New Details");
            console.log(details);
            let db = await cds.connect.to('db');
            const { programVendor_Table } = cds.entities("ProgramAdmin");
            const { programVendorNew_Table } = cds.entities("ProgramAdmin");
            let res = await db.run(DELETE.from(programVendor_Table));
            let res1 = await db.run(DELETE.from(programVendorNew_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramVendorSet } = service.entities;
            let tx = cds.transaction(req);
            const details1 = await tx.run(SELECT.from(ProgramVendorSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            console.log("Details1");
            console.log(details1);
            let rs2 = await db.run(INSERT.into(programVendorNew_Table).entries(details1));
            console.log(rs2);
            let details = {
                "OBJECT_KEY": OBJECT_KEY,
                "PROGRAM_UUID": PROGRAM_UUID,
                "VENDOR_ID": VENDOR_ID,
                "DISTRIBUTOR": DISTRIBUTOR,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_DESC": details1[0].EN_DESC,
                "FR_DESC": details1[0].FR_DESC,
                "CHANGED_BY": CHANGED_BY
            };
            let rs = await db.run(INSERT.into(programVendor_Table).entries(details));

            //const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMVENDORUPDATE"( it_new => PROGRAMADMIN_PROGRAMVENDOR_TABLE , it_old => PROGRAMADMIN_PROGRAMVENDORNEW_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results)
            if (results.EX_ERROR[0] == null) {
                return "Success";
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
        }
        catch (error) {
            console.error(error)
            return req.error;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORDELETE'
    srv.on('programVendorDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programVendor_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programVendor_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramVendorSet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramVendorSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programVendor_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMVENDORDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMVENDOR_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Program Vendor Delete Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYLOCATIONCREATE'
    // Done
    srv.on('programDeliveryLocationCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let VENDOR_ID = req.data.VENDOR_ID;
            let DEL_LOCATION_ID = req.data.DEL_LOCATION_ID;
            let LANG = req.data.LANG;
            let DEL_LOCATION_NAME = req.data.DEL_LOCATION_NAME;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let VENDOR_TYPE = req.data.VENDOR_TYPE;
            let EN_DEL_LOCATION_NAME = req.data.EN_DEL_LOCATION_NAME;
            let FR_DEL_LOCATION_NAME = req.data.FR_DEL_LOCATION_NAME;
            let DEL_ADDRESS1 = req.data.DEL_ADDRESS1;
            let DEL_ADDRESS2 = req.data.DEL_ADDRESS2;
            let DEL_CITY = req.data.DEL_CITY;
            let DEL_PROVINCE = req.data.DEL_PROVINCE;
            let DEL_POSTAL_CODE = req.data.DEL_POSTAL_CODE;
            let DEL_PHONE_NUMBER = req.data.DEL_PHONE_NUMBER;
            let CHANGED_BY = req.data.CHANGED_BY;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "VENDOR_ID": VENDOR_ID,
                "DEL_LOCATION_ID": DEL_LOCATION_ID,
                "LANG": LANG,
                "DEL_LOCATION_NAME": DEL_LOCATION_NAME,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "VENDOR_TYPE": VENDOR_TYPE,
                "EN_DEL_LOCATION_NAME": EN_DEL_LOCATION_NAME,
                "FR_DEL_LOCATION_NAME": FR_DEL_LOCATION_NAME,
                "DEL_ADDRESS1": DEL_ADDRESS1,
                "DEL_ADDRESS2": DEL_ADDRESS2,
                "DEL_CITY": DEL_CITY,
                "DEL_PROVINCE": DEL_PROVINCE,
                "DEL_POSTAL_CODE": DEL_POSTAL_CODE,
                "DEL_PHONE_NUMBER": DEL_PHONE_NUMBER,
                "CHANGED_BY": CHANGED_BY
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programDeliveryLocation_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programDeliveryLocation_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programDeliveryLocation_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONCREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMDELIVERYLOCATION_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
            // return results;
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYLOCATIONUPDATE'
    srv.on('programDeliveryLocationUpdate', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let VENDOR_ID = req.data.VENDOR_ID;
            let DEL_LOCATION_ID = req.data.DEL_LOCATION_ID;
            let LANG = req.data.LANG;
            let DEL_LOCATION_NAME = req.data.DEL_LOCATION_NAME;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let VENDOR_TYPE = req.data.VENDOR_TYPE;
            let EN_DEL_LOCATION_NAME = req.data.EN_DEL_LOCATION_NAME;
            let FR_DEL_LOCATION_NAME = req.data.FR_DEL_LOCATION_NAME;
            let DEL_ADDRESS1 = req.data.DEL_ADDRESS1;
            let DEL_ADDRESS2 = req.data.DEL_ADDRESS2;
            let DEL_CITY = req.data.DEL_CITY;
            let DEL_PROVINCE = req.data.DEL_PROVINCE;
            let DEL_POSTAL_CODE = req.data.DEL_POSTAL_CODE;
            let DEL_PHONE_NUMBER = req.data.DEL_PHONE_NUMBER;
            let CHANGED_BY = req.data.CHANGED_BY;
            let details = {
                "OBJECT_KEY": OBJECT_KEY,
                "PROGRAM_UUID": PROGRAM_UUID,
                "VENDOR_ID": VENDOR_ID,
                "DEL_LOCATION_ID": DEL_LOCATION_ID,
                "LANG": LANG,
                "DEL_LOCATION_NAME": DEL_LOCATION_NAME,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "VENDOR_TYPE": VENDOR_TYPE,
                "EN_DEL_LOCATION_NAME": EN_DEL_LOCATION_NAME,
                "FR_DEL_LOCATION_NAME": FR_DEL_LOCATION_NAME,
                "DEL_ADDRESS1": DEL_ADDRESS1,
                "DEL_ADDRESS2": DEL_ADDRESS2,
                "DEL_CITY": DEL_CITY,
                "DEL_PROVINCE": DEL_PROVINCE,
                "DEL_POSTAL_CODE": DEL_POSTAL_CODE,
                "DEL_PHONE_NUMBER": DEL_PHONE_NUMBER,
                "CHANGED_BY": CHANGED_BY
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details we got");
            console.log(details);
            let db = await cds.connect.to('db');
            const { programDeliveryLocation_Table } = cds.entities("ProgramAdmin");
            const { programDeliveryLocationNew_Table } = cds.entities("ProgramAdmin");
            let res = await db.run(DELETE.from(programDeliveryLocation_Table));
            console.log(res);
            let res1 = await db.run(DELETE.from(programDeliveryLocationNew_Table));
            console.log(res1);
            let rs = await db.run(INSERT.into(programDeliveryLocation_Table).entries(details));
            console.log(rs);
            const service = await cds.connect.to('BookingProgram');
            const { ProgramDeliveryLocationSet } = service.entities;
            let tx = cds.transaction(req);
            const details1 = await tx.run(SELECT.from(ProgramDeliveryLocationSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            console.log("Details1");
            console.log(details1);
            let rs2 = await db.run(INSERT.into(programDeliveryLocationNew_Table).entries(details1));
            console.log(rs2);
            //const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONUPDATE"( it_new => PROGRAMADMIN_PROGRAMDELIVERYLOCATION_TABLE , it_old => PROGRAMADMIN_PROGRAMDELIVERYLOCATIONNEW_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [it_new, it_old])
            // const { O1 } = await cds.run(dbQuery)
            const results = await cds.run(dbQuery);
            console.log(results)
            if (results.EX_ERROR[0] == null) {
                return "Success";
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
            // const { im_details } = req.data;
            // let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONUPDATE"( ? , ?,EX_ERROR => ?)`;
            // let results = await cds.run(dbQuery, [im_details])
            // // const { O1 } = await cds.run(dbQuery)
            // console.log(results)
            // //let result = { "records": JSON.stringify(results.O1) }
            // return results
        }
        catch (error) {
            console.error(error)
            return;
        }
    });


    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYLOCATIONDELETE'
    srv.on('programDeliveryLocationDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programDeliveryLocation_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programDeliveryLocation_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramDeliveryLocationSet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramDeliveryLocationSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programDeliveryLocation_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMDELIVERYLOCATION_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("ProgramDeliveryLocationDelete Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYMETHODCREATE'
    //Done
    srv.on('programDeliveryMethodCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let VENDOR_ID = req.data.VENDOR_ID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let DEL_METHOD = req.data.DEL_METHOD;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let EN_DEL_M_NAME = req.data.EN_DEL_M_NAME;
            let FR_DEL_M_NAME = req.data.FR_DEL_M_NAME;
            let EN_VENDOR_DESC = req.data.EN_VENDOR_DESC;
            let FR_VENDOR_DESC = req.data.FR_VENDOR_DESC;
            let EN_CATEGORY_DESC = req.data.EN_CATEGORY_DESC;
            let FR_CATEGORY_DESC = req.data.FR_CATEGORY_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            let DONOTTRANSPORT = req.data.DONOTTRANSPORT;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "VENDOR_ID": VENDOR_ID,
                "CATEGORY_ID": CATEGORY_ID,
                "DEL_METHOD": DEL_METHOD,
                "VALID": VALID,
                "BATCH_MODE": 'X',
                "ERROR_CODES": ERROR_CODES,
                "EN_DEL_M_NAME": EN_DEL_M_NAME,
                "FR_DEL_M_NAME": FR_DEL_M_NAME,
                "EN_VENDOR_DESC": EN_VENDOR_DESC,
                "FR_VENDOR_DESC": FR_VENDOR_DESC,
                "EN_CATEGORY_DESC": EN_CATEGORY_DESC,
                "FR_CATEGORY_DESC": FR_CATEGORY_DESC,
                "CHANGED_BY": CHANGED_BY,
                "DONOTTRANSPORT": DONOTTRANSPORT
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programDeliveryMethod_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programDeliveryMethod_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programDeliveryMethod_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODCREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMDELIVERYMETHOD_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                req.reject(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
            //return results;
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
        }
        // try {
        //     const { im_details } = req.data;
        //     let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODCREATE"( ? ,EX_ERROR => ?)`;
        //     let results = await cds.run(dbQuery, [im_details])
        //     // const { O1 } = await cds.run(dbQuery)
        //     console.log(results)
        //     //let result = { "records": JSON.stringify(results.O1) }
        //     return results
        // } catch (error) {
        //     console.error(error)
        //     return;
        // }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYMETHODDELETE'
    srv.on('programDeliveryMethodDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programDeliveryMethod_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programDeliveryMethod_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramDeliveryMethodSet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramDeliveryMethodSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programDeliveryMethod_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMDELIVERYMETHOD_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.reject(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            //return "Success";
        } catch (error) {
            console.error(error)
            req.error(error);
        }
        // try {
        //     const { im_details } = req.data;
        //     let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODDELETE"( ? ,EX_ERROR => ?)`;
        //     let results = await cds.run(dbQuery, [im_details])
        //     // const { O1 } = await cds.run(dbQuery)
        //     console.log(results)
        //     //let result = { "records": JSON.stringify(results.O1) }
        //     return results
        // } catch (error) {
        //     console.error(error)
        //     return;
        // }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTCREATE'
    //Done
    srv.on('programPartCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let VENDOR_ID = req.data.VENDOR_ID;
            let CATEGORY_ID = req.data.CATEGORY_ID;
            let PART_NUM = req.data.PART_NUM;
            let DETAIL = req.data.DETAIL;
            let TIRESIZE = req.data.TIRESIZE;
            let SPEEDRATING = req.data.SPEEDRATING;
            let LOADRATING = req.data.LOADRATING;
            let DEALERNET = req.data.DEALERNET;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let EN_DESC = req.data.EN_DESC;
            let FR_DESC = req.data.FR_DESC;
            let EN_VENDOR_DESC = req.data.EN_VENDOR_DESC;
            let FR_VENDOR_DESC = req.data.FR_VENDOR_DESC;
            let EN_CATEGORY_DESC = req.data.EN_CATEGORY_DESC;
            let FR_CATEGORY_DESC = req.data.FR_CATEGORY_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            let DONOTTRANSPORT = req.data.DONOTTRANSPORT;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "VENDOR_ID": VENDOR_ID,
                "CATEGORY_ID": CATEGORY_ID,
                "PART_NUM": PART_NUM,
                "DETAIL": DETAIL,
                "TIRESIZE": TIRESIZE,
                "SPEEDRATING": SPEEDRATING,
                "LOADRATING": LOADRATING,
                "DEALERNET": DEALERNET,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_DESC": EN_DESC,
                "FR_DESC": FR_DESC,
                "EN_VENDOR_DESC": EN_VENDOR_DESC,
                "FR_VENDOR_DESC": FR_VENDOR_DESC,
                "EN_CATEGORY_DESC": EN_CATEGORY_DESC,
                "FR_CATEGORY_DESC": FR_CATEGORY_DESC,
                "CHANGED_BY": CHANGED_BY,
                "DONOTTRANSPORT": DONOTTRANSPORT
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programPart_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programPart_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programPart_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTCREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMPART_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            // return results;
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR[0]);
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTDELETE'
    srv.on('programPartDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programPart_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programPart_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramPartSet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramPartSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programPart_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMPART_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.reject(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            //return results;
        } catch (error) {
            console.error(error)
            req.error(results.EX_ERROR[0]);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTFITMENTCREATE'
    //Done
    srv.on('programPartFitmentCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let PART_NUM = req.data.PART_NUM;
            let MODEL_CODE = req.data.MODEL_CODE;
            let SERIES_CODE = req.data.SERIES_CODE;
            let YEAR = req.data.YEAR;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let EN_PART_DESC = req.data.EN_PART_DESC;
            let FR_PART_DESC = req.data.FR_PART_DESC;
            let EN_MODEL_DESC = req.data.EN_MODEL_DESC;
            let FR_MODEL_DESC = req.data.FR_MODEL_DESC;
            let BRAND = req.data.BRAND;
            let BRAND_NAME = req.data.BRAND_NAME;
            let CHANGED_BY = req.data.CHANGED_BY;
            let EN_SERIES_DESC = req.data.EN_SERIES_DESC;
            let FR_SERIES_DESC = req.data.FR_SERIES_DESC;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "PART_NUM": PART_NUM,
                "MODEL_CODE": MODEL_CODE,
                "SERIES_CODE": SERIES_CODE,
                "YEAR": YEAR,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_PART_DESC": EN_PART_DESC,
                "FR_PART_DESC": FR_PART_DESC,
                "EN_MODEL_DESC": EN_MODEL_DESC,
                "FR_MODEL_DESC": FR_MODEL_DESC,
                "BRAND": BRAND,
                "BRAND_NAME": BRAND_NAME,
                "CHANGED_BY": CHANGED_BY,
                "EN_SERIES_DESC": EN_SERIES_DESC,
                "FR_SERIES_DESC": FR_SERIES_DESC
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programPartFitment_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programPartFitment_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programPartFitment_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTFITMENTCREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMPARTFITMENT_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.reject(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
        } catch (error) {
            console.error(error)
            req.error(error);
        }
        // try {
        //     const { im_details } = req.data;
        //     let dbQuery = `Call "PROCEDURES_PROGRAMPARTFITMENTCREATE"( ? ,EX_ERROR => ?)`;
        //     let results = await cds.run(dbQuery, [im_details])
        //     // const { O1 } = await cds.run(dbQuery)
        //     console.log(results)
        //     //let result = { "records": JSON.stringify(results.O1) }
        //     return results
        // } catch (error) {
        //     console.error(error)
        //     return;
        // }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTFITMENTDELETE'
    srv.on('programPartFitmentDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programPartFitment_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programPartFitment_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramPartFitmentSet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramPartFitmentSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programPartFitment_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTFITMENTDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMPARTFITMENT_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
            //return results;
            //return "Success";
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMPRIORPURCHASEMINICREATE'
    srv.on('programPriorPurchaseMiniCreate', async (req) => {
        try {
            //let OBJECT_KEY = req.data.OBJECT_KEY;
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            let DEALER_CODE = req.data.DEALER_CODE;
            let DEALER_CODE_S = req.data.DEALER_CODE_S;
            let PART_NUM = req.data.PART_NUM;
            let PRIOR_PURCHASES = req.data.PRIOR_PURCHASES;
            let VALID = req.data.VALID;
            let BATCH_MODE = req.data.BATCH_MODE;
            let ERROR_CODES = req.data.ERROR_CODES;
            let EN_PART_DESC = req.data.EN_PART_DESC;
            let FR_PART_DESC = req.data.FR_PART_DESC;
            let EN_DEALER_DESC = req.data.EN_DEALER_DESC;
            let FR_DEALER_DESC = req.data.FR_DEALER_DESC;
            let CHANGED_BY = req.data.CHANGED_BY;
            let BRAND = req.data.BRAND;
            let details = {
                "OBJECT_KEY": cds.utils.uuid(),
                "PROGRAM_UUID": PROGRAM_UUID,
                "BRAND":BRAND,
                "DEALER_CODE": DEALER_CODE,
                "DEALER_CODE_S": DEALER_CODE_S,
                "PART_NUM": PART_NUM,
                "PRIOR_PURCHASES": PRIOR_PURCHASES,
                "VALID": VALID,
                "BATCH_MODE": BATCH_MODE,
                "ERROR_CODES": ERROR_CODES,
                "EN_PART_DESC": EN_PART_DESC,
                "FR_PART_DESC": FR_PART_DESC,
                "EN_DEALER_DESC": EN_DEALER_DESC,
                "FR_DEALER_DESC": FR_DEALER_DESC,
                "CHANGED_BY": CHANGED_BY,
                // "validFrom": Date(),
                // "validTo":''
            };
            console.log("Details :");
            console.log(details);
            console.log(details.PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programPriorPurchase_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programPriorPurchase_Table));
            console.log("Deletion");
            console.log(rs1);
            let rs = await db.run(INSERT.into(programPriorPurchase_Table).entries(details));
            console.log("Insertion");
            console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMPRIORPURCHASEMINICREATE"( IM_DETAILS => PROGRAMADMIN_PROGRAMPRIORPURCHASE_TABLE,EX_ERROR => ?)`;
            //let results = await cds.run(dbQuery, [PROGRAMADMIN_BOOKINGPROGRAMSUMMARY_TB]);
            const results = await cds.run(dbQuery);
            console.log(results);
            console.log("____________");
            console.log(results.EX_ERROR);
            if (results.EX_ERROR[0] == null) {
                return details;
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.reject(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR[0];
            }
            //return results;
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });

    // Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPRIORPURCHASEMINIDELETE'
    srv.on('programPriorPurchaseMiniDelete', async (req) => {
        try {
            let OBJECT_KEY = req.data.OBJECT_KEY;
            console.log(OBJECT_KEY);
            let db = await cds.connect.to('db');
            const { programPriorPurchase_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programPriorPurchase_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramPriorPurchaseSet } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramPriorPurchaseSet).where({ "OBJECT_KEY": OBJECT_KEY }));
            let rs = await db.run(INSERT.into(programPriorPurchase_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMPRIORPURCHASEMINIDELETE"( IM_DETAILS => PROGRAMADMIN_PROGRAMPRIORPURCHASE_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            if (results.EX_ERROR[0] == null) {
                return "Deleted";
            }
            if (results.EX_ERROR[0] != null) {
                console.log(results.EX_ERROR[0].HTTP_STATUS_CODE);
                console.log(results.EX_ERROR[0].ERROR_MESSAGE);
                console.log(results.EX_ERROR[0].DETAIL);
                console.log("Error");
                //req.error(results.EX_ERROR[0].HTTP_STATUS_CODE, results.EX_ERROR[0].ERROR_MESSAGE);
                return results.EX_ERROR;
            }
            //console.log(results);
            //return results;
            //return "Success";
        } catch (error) {
            console.error(error)
            req.error(error);
        }
    });



    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMCATEGORYDELETEBATCH'
    //programPriorPurchase_Table
    srv.on('programCategoryDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORDELETEBATCH'
    srv.on('programVendorDeleteBatch', async (req) => {
        try {
            let PROGRAM_UUID = req.data.PROGRAM_UUID;
            console.log(PROGRAM_UUID);
            let db = await cds.connect.to('db');
            const { programVendorAll_Table } = cds.entities("ProgramAdmin");
            let rs1 = await db.run(DELETE.from(programVendorAll_Table));
            const service = await cds.connect.to('BookingProgram');
            const { ProgramVendorAll } = service.entities;
            let tx = cds.transaction(req);
            const details = await tx.run(SELECT.from(ProgramVendorAll).where({ "PROGRAM_UUID": PROGRAM_UUID }));
            let rs = await db.run(INSERT.into(programVendorAll_Table).entries(details));
            //console.log(rs);
            let dbQuery = `Call "PROCEDURES_PROGRAMVENDORDELETEBATCH"( IM_DETAILS => PROGRAMADMIN_PROGRAMTEMP_TABLE,EX_ERROR => ?)`;
            const results = await cds.run(dbQuery);
            console.log(results);
            return results;
            //return "Success";
        } catch (error) {
            console.error(error)
            req.error(error);
        }
        // try {
        //     const { PROGRAM_UUID } = req.data.PROGRAM_UUID;
        //     let dbQuery = `Call "PROCEDURES_PROGRAMVENDORDELETEBATCH"( ? ,EX_ERROR => ?)`;
        //     let results = await cds.run(dbQuery, [im_details])
        //     // const { O1 } = await cds.run(dbQuery)
        //     console.log(results)
        //     //let result = { "records": JSON.stringify(results.O1) }
        //     return results
        // } catch (error) {
        //     console.error(error)
        //     return;
        // }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYLOCATIONDELETEBATCH'
    srv.on('programDeliveryLocationDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORDELIVERYLOCATIONDELETEBATCH'
    srv.on('programVendorDeliveryLocationDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMVENDORDELIVERYLOCATIONDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYMETHODDELETEBATCH'
    srv.on('programDeliveryMethodDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTDELETEBATCH'
    srv.on('programPartDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPRIORPURCHASEMINIDELETEBATCH'
    srv.on('programPriorPurchaseMiniDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMPRIORPURCHASEMINIDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTFITMENTDELETEBATCH'
    srv.on('programPartFitmentDeleteBatch', async (req) => {
        try {
            const { im_details } = req.data;
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTFITMENTDELETEBATCH"( ? ,EX_ERROR => ?)`;
            let results = await cds.run(dbQuery, [im_details])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });


    //XSJS Functions  

    // Call Hana Procedure 'PROCEDURES_PROGRAMCATEGORYDELETEALL'
    srv.on('categoryDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            console.log(IM_PROGRAM_UUID);
            let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYDELETEALL"( im_program_uuid => ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID]);
            //const results = await cds.run(dbQuery);
            console.log(results);
            console.log("Deleting Categories.....");
            return results;
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Getting Dealer_Code value from entity 'Dealer_Booking_Period'
    srv.on('dealerBooked', async (req) => {
        let tx = cds.transaction(req);
        const programUuid = req.data.programUUID;
        const { DEALER_BOOKING_PERIOD } = cds.entities("ProgramBooking");
        const query = await tx.run(SELECT.distinct.from(DEALER_BOOKING_PERIOD).columns('DEALER_CODE').where({ "PROGRAM_UUID": programUuid }));
        console.log(query);
        return query;

    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYLOCATIONDELETEALL'
    srv.on('deliveryLocationDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONDELETEALL"( ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYMETHODDELETEALL'
    srv.on('deliveryMethodDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODDELETEALL"( ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });


    srv.on('index', async (req) => {
        //console.log('index');
        let tx = cds.transaction(req);
        const { ERROR_CODE } = cds.entities("Core");
        let query = await tx.run(SELECT.from(ERROR_CODE));
        //console.log('Query : ');
        console.log(query);
        return query;
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTFITMENTDELETEALL'
    srv.on('partFitmentDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTFITMENTDELETEALL"( ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            //let result = { "records": JSON.stringify(results.O1) }
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });


    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTDELETEALL'
    srv.on('partsDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            let dbQuery = `Call "PROCEDURES_PROGRAMPARTDELETEALL"( ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID])
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMPRIORPURCHASEMINIDELETEALL'
    srv.on('priorPurchaseDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            let dbQuery = `Call "PROCEDURES_PROGRAMPRIORPURCHASEMINIDELETEALL"( ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID]);
            // const { O1 } = await cds.run(dbQuery)
            console.log(results)
            return results
        } catch (error) {
            console.error(error)
            return;
        }
    });

    srv.on('seriesYear', async (req) => {
        let tx = cds.transaction(req);
        const programUuid = req.data.programUUID;
        const { programPartFitmentView } = cds.entities("ProgramAdmin");
        const query = await tx.run(SELECT.distinct.from(programPartFitmentView).columns(['SERIES_CODE', 'EN_SERIES_DESC', 'FR_SERIES_DESC', 'YEAR']).where({ "PROGRAM_UUID": programUuid }).orderBy({ YEAR: 'desc' }));
        console.log(query);
        return query;
    });

    srv.on('seriesYearBrand', async (req) => {
        let tx = cds.transaction(req);
        const programUuid = req.data.programUUID;
        const brand = req.data.division;
        const { programPartFitmentView } = cds.entities("ProgramAdmin");
        const query = await tx.run(SELECT.distinct.from(programPartFitmentView).columns(['SERIES_CODE', 'EN_SERIES_DESC', 'FR_SERIES_DESC', 'YEAR']).where({ and: { "PROGRAM_UUID": programUuid, "BRAND": brand } }));
        console.log(query);
        return query;
    });

    srv.on('tiresizeInput', async (req) => {
        let tx = cds.transaction(req);
        const programUuid = req.data.programUUID;
        console.log("Tire Size Input");
        console.log(programUuid);
        const { programPartView } = cds.entities("ProgramAdmin");
        //const service = await cds.connect.to('BookingProgram');
        //const { TireVendorDropDownSet } = service.entities;
        const query = await tx.run(SELECT.distinct.from(programPartView).columns(['TIRESIZE']).where({ "PROGRAM_UUID": programUuid }));
        console.log(query);
        console.log(query[0]);
        return query;
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORDELETEALL'
    srv.on('vendorDeleteAll', async (req) => {
        try {
            const IM_PROGRAM_UUID = req.data.programUuid;
            let dbQuery = `Call "PROCEDURES_PROGRAMVENDORDELETEALL"( ? ,ex_code => ?)`;
            let results = await cds.run(dbQuery, [IM_PROGRAM_UUID]);
            // const { O1 } = await cds.run(dbQuery)
            console.log("Vendor Delete All" + results)
            return results;
        } catch (error) {
            console.error(error)
            return req.error(error);
        }
    });

    srv.on('allDealerBookingReport', async (req) => {
        let tx = cds.transaction(req);
        debugger;
        // console.log(req.data);
        // console.log(req.params);
        const programUid = req.data.programUUID;
        console.log(programUid);
        console.log("Service")
        const service = await cds.connect.to('BookingProgram');
        const { DealerBookingReportSet } = service.entities;
        console.log("query");
        // const query = await service.get("/DealerBookingReportSet(PROGRAMUID = `${programUid}`, LANGUAGE = 'EN')/Set")
        //(PROGRAMUID = `${programUid}`, LANGUAGE = 'EN')
       // const query = SELECT.from(DealerBookingReportSet,{"PROGRAMUID" : `${programUid}`, "LANGUAGE" : 'EN' });
        const query = "BOOKINGPROGRAM_DEALERBOOKINGREPORTSET(PROGRAMUID: '"+programUid+"',LANGUAGE:'EN')";
        let result = await cds.run(SELECT.from(query));
        // const query = await tx.run(SELECT.distinct.from(DealerBookingReportSet).where({ and: { "PROGRAMUID": programUid, "LANGUAGE": 'EN' } }));//.orderBy('DEALER_CODE'));
        // from: { ref: [{ id: "Abc", where: [{ ref: ["key"] }, "=", { val: `${value}` }] }, "Set"] },
        // const query = await tx.run({
        //     SELECT: {
        //         from: {
        //             ref: [
        //                 {
        //                     id: DealerBookingCategoryDeliverySet,
        //                     args: { DEALER_CODE :{val:'D003'}, LANGUAGE: { val: 'EN' },PROGRAMUID: { val: programUid } }
        //                 }
        //             ]
        //         }
        //     }//.limit(20000)
        // });
        // console.log(query);
        
        //console.log(query);
        console.log(result);
        return result;
    });


    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYLOCATIONADD'
    srv.on('deliveryLocationUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Delivery Location...");
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID   " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_VENDOR = updateList[i].vendorId;
                    // console.log(IM_VENDOR);
                    let IM_LOCATIONID = updateList[i].locationId;
                    // console.log(IM_LOCATIONID);
                    let IM_PHONENUMBER = updateList[i].phoneNumber;
                    // console.log(IM_PHONENUMBER);
                    let IM_ADDRESS1 = updateList[i].address1;
                    // console.log(IM_ADDRESS1);
                    let IM_ADDRESS2 = updateList[i].address2;
                    // console.log(IM_ADDRESS2);
                    let IM_CITY = updateList[i].city;
                    // console.log(IM_CITY);
                    let IM_PROVINCE = updateList[i].province;
                    // console.log(IM_PROVINCE);
                    let IM_POSTALCODE = updateList[i].postalCode;
                    //  console.log(IM_POSTALCODE);
                    let IM_EN_DESC = updateList[i].enDesc;
                    //  console.log(IM_EN_DESC);
                    let IM_FR_DESC = updateList[i].frDesc;
                    // console.log(IM_FR_DESC);
                    let IM_ERRORS = updateList[i].errorsCodes ? updateList[i].errorsCodes : '';
                    //console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    // console.log("IM_INVALID " + IM_INVALID);
                    let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYLOCATIONADD"( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, EX_CODE => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_VENDOR, IM_LOCATIONID, IM_PHONENUMBER, IM_ADDRESS1, IM_ADDRESS2, IM_CITY, IM_PROVINCE, IM_POSTALCODE, IM_EN_DESC, IM_FR_DESC, IM_ERRORS, IM_USER, IM_INVALID]);
                    // let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYADD"( ? , ?, ?, ?, ?, ?, ?, ?, EX_CODE => ?)`;
                    // let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_CATEGORY, IM_EN_DESC, IM_FR_DESC, IM_DONOTTRANSPORT, IM_ERRORS, IM_USER, IM_INVALID]);
                    if (results) {
                        console.log("DeliveryLocationAdd" + i + "Result " + results);
                        //console.log(results);
                    }
                    rs[i] = results;
                }

                catch (err) {
                    req.error(err);
                }
            }
            // console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            return;
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMCATEGORYADD'
    srv.on('categoryUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Categories...");
            //console.log("UUID "+list.programUuid+"User "+list.updatedBy);
            //console.log(list.updateList);
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_CATEGORY = updateList[i].categoryId;
                    console.log(IM_CATEGORY);
                    let IM_EN_DESC = updateList[i].enDesc;
                    console.log(IM_EN_DESC);
                    let IM_FR_DESC = updateList[i].frDesc;
                    console.log(IM_FR_DESC);
                    let IM_DONOTTRANSPORT = '';//updateList[i].donottransport;
                    console.log(IM_DONOTTRANSPORT);
                    let IM_ERRORS = updateList[i].errorsCodes ? updateList[i].errorsCodes : '';
                    console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    console.log("IM_INVALID " + IM_INVALID);
                    let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYADD"( ? , ?, ?, ?, ?, ?, ?, ?, EX_CODE => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_CATEGORY, IM_EN_DESC, IM_FR_DESC, IM_DONOTTRANSPORT, IM_ERRORS, IM_USER, IM_INVALID]);
                    console.log("CategoryAdd" + i + "Result" + results);
                    rs[i] = results;
                }
                catch (err) {
                    req.error(err);
                }
            }
            console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            //return
            return req.error(error);
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMDELIVERYMETHODADD'
    srv.on('deliveryMethodUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Delivery Method...");
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_CATEGORY = updateList[i].categoryId;
                    console.log(IM_CATEGORY);
                    let IM_VENDOR = updateList[i].vendorId;
                    console.log(IM_VENDOR);
                    let IM_DEL_METHOD = updateList[i].delMethod;
                    console.log(IM_DEL_METHOD);
                    let IM_ERRORS = updateList[i].errorsCodes;
                    console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    console.log("IM_INVALID " + IM_INVALID);
                    // let dbQuery = `Call "PROCEDURES_PROGRAMCATEGORYADD"( ? , ?, ?, ?, ?, ?, ?, ?, EX_CODE => ?)`;
                    // let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_CATEGORY, IM_EN_DESC, IM_FR_DESC, IM_DONOTTRANSPORT, IM_ERRORS, IM_USER, IM_INVALID]);
                    let dbQuery = `Call "PROCEDURES_PROGRAMDELIVERYMETHODADD"( ? , ?, ?, ?, ?, ?, ?, ex_code => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_CATEGORY, IM_VENDOR, IM_DEL_METHOD, IM_ERRORS, IM_USER, IM_INVALID])
                    console.log("CategoryAdd" + i + "Result" + results);
                    rs[i] = results;
                }

                catch (err) {
                    req.error(err);
                }
            }
            console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            return;
        }
    });


    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTFITMENTADD'
    srv.on('partFitmentUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Part Fitment...");
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_PARTID = updateList[i].partId;
                    console.log(IM_PARTID);
                    let IM_MODELCODE = updateList[i].modelCode;
                    console.log(IM_MODELCODE);
                    let IM_SERIESCODE = updateList[i].SERIES_CODE;
                    console.log(IM_SERIESCODE);
                    let IM_EN_DESC = updateList[i].enDesc;
                    console.log(IM_EN_DESC);
                    let IM_FR_DESC = updateList[i].frDesc;
                    console.log(IM_FR_DESC);
                    let IM_EN_SERIESDESC = updateList[i].EN_SERIES_DESC;
                    console.log(IM_EN_SERIESDESC);
                    let IM_FR_SERIESDESC = updateList[i].FR_SERIES_DESC;
                    console.log(IM_FR_SERIESDESC);
                    let IM_MODELYEAR = updateList[i].modelYear;
                    console.log(IM_MODELYEAR);
                    let IM_BRAND = updateList[i].brand;
                    console.log(IM_BRAND);
                    let IM_BRANDNAME = updateList[i].brandName;
                    console.log(IM_BRANDNAME);
                    let IM_ERRORS = updateList[i].errorsCodes;
                    console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    console.log("IM_INVALID " + IM_INVALID);
                    let dbQuery = `Call "PROCEDURES_PROGRAMPARTFITMENTADD"( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, EX_CODE => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_PARTID, IM_MODELCODE, IM_SERIESCODE, IM_EN_DESC, IM_FR_DESC, IM_EN_SERIESDESC, IM_FR_SERIESDESC, IM_MODELYEAR, IM_BRAND, IM_BRANDNAME, IM_ERRORS, IM_USER, IM_INVALID]);
                    console.log("Part Fitment" + i + "Result" + results);
                    rs[i] = results;
                }

                catch (err) {
                    req.error(err);
                }
            }
            console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            return;
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMPARTADD'
    srv.on('partsUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Delivery Location...");
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_PARTID = updateList[i].partId;
                    console.log(IM_PARTID);
                    let IM_EN_DESC = updateList[i].enDesc;
                    console.log(IM_EN_DESC);
                    let IM_FR_DESC = updateList[i].frDesc;
                    console.log(IM_FR_DESC);
                    let IM_DETAIL = updateList[i].detail;
                    console.log(IM_DETAIL);
                    let IM_CATEGORY = updateList[i].categoryId;
                    console.log(IM_CATEGORY);
                    let IM_VENDOR = updateList[i].vendorId;
                    console.log(IM_VENDOR);
                    let IM_ERRORS = updateList[i].errorsCodes;
                    console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    console.log("IM_INVALID " + IM_INVALID);
                    let IM_TIRESIZE = updateList[i].tiresize;
                    console.log(IM_TIRESIZE);
                    let IM_SPEEDRATING = updateList[i].speedrating;
                    console.log(IM_SPEEDRATING);
                    let IM_LOADRATING = updateList[i].loadrating;
                    console.log(IM_LOADRATING);
                    let IM_DEALERNET = updateList[i].dealernet;
                    console.log(IM_DEALERNET);
                    let dbQuery = `Call "PROCEDURES_PROGRAMPARTADD"( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, EX_CODE => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_PARTID, IM_EN_DESC, IM_FR_DESC, IM_DETAIL, IM_CATEGORY, IM_VENDOR, IM_ERRORS, IM_USER, IM_INVALID, IM_TIRESIZE, IM_SPEEDRATING, IM_LOADRATING, IM_DEALERNET]);
                    console.log("DeliveryLocationAdd" + i + "Result" + results);
                    rs[i] = results;
                }

                catch (err) {
                    req.error(err);
                }
            }
            console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            return;
        }
    });

    //Pending
    // Call Hana Procedure 'PROCEDURES_PROGRAMPRIORPURCHASEMINIADD'
    srv.on('priorPurchaseUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Prior Purchases...");
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_DEALERID = updateList[i].dealerId;
                    console.log(IM_DEALERID);
                    let IM_DEALERCODE = updateList[i].dealerCode;
                    console.log(IM_DEALERCODE);
                    let IM_EN_DESC = updateList[i].enDesc;
                    console.log(IM_EN_DESC);
                    let IM_FR_DESC = updateList[i].frDesc;
                    console.log(IM_FR_DESC);
                    let IM_PARTID = updateList[i].partId;
                    console.log(IM_PARTID);
                    let IM_PURCHASE = updateList[i].purchase;//Need to check Parameter from UI
                    console.log(IM_PURCHASE);
                    let IM_ERRORS = updateList[i].errorsCodes?updateList[i].errorsCodes:'';
                    console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    console.log("IM_INVALID " + IM_INVALID);
                    let dbQuery = `Call "PROCEDURES_PROGRAMPRIORPURCHASEMINIADD"( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ex_code => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_DEALERID, IM_DEALERCODE, IM_EN_DESC, IM_FR_DESC, IM_PARTID, IM_PURCHASE, IM_ERRORS, IM_USER, IM_INVALID]);
                    console.log("Prior Purchase" + i + "Result" + results);
                    rs[i] = results;
                }

                catch (err) {
                    req.error(err);
                }
            }
            console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            return;
        }
    });

    // Call Hana Procedure 'PROCEDURES_PROGRAMVENDORADD'
    srv.on('vendorUploader', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Vendors...");
            //console.log("UUID "+list.programUuid+"User "+list.updatedBy);
            //console.log(list.updateList);
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("UUID " + data1.programUuid + " User " + data1.updatedBy);
            console.log(data1.updateList);
            let updateList = data1.updateList;
            let len = updateList.length;
            console.log("Length " + len);
            let IM_PROGRAM_UUID = data1.programUuid;
            console.log("UUID " + IM_PROGRAM_UUID);
            let IM_USER = data1.updatedBy;
            console.log("User " + IM_USER);
            console.log("_______________");
            console.log(updateList[0]);
            let rs = [];
            for (i = 0; i < len; i++) {
                console.log("Iteration " + i);
                try {
                    let IM_VENDOR = updateList[i].vendorId;
                    console.log(IM_VENDOR);
                    let IM_DISTRIBUTOR = updateList[i].distributor;
                    let IM_EN_DESC = updateList[i].enDesc;
                    console.log(IM_EN_DESC);
                    let IM_FR_DESC = updateList[i].frDesc;
                    console.log(IM_FR_DESC);
                    let IM_ERRORS = updateList[i].errorsCodes;
                    console.log("IM_ERRORS " + IM_ERRORS);
                    let IM_INVALID = updateList[i].hasError;
                    console.log("IM_INVALID " + IM_INVALID);
                    let dbQuery = `Call "PROCEDURES_PROGRAMVENDORADD"( ? , ?, ?, ?, ?, ?, ?, ?, ex_code => ?)`;
                    let results = await cds.run(dbQuery, [IM_PROGRAM_UUID, IM_VENDOR, IM_DISTRIBUTOR, IM_EN_DESC, IM_FR_DESC, IM_ERRORS, IM_USER, IM_INVALID]);
                    console.log("CategoryAdd" + i + "Result" + results);
                    rs[i] = results;
                }
                catch (err) {
                    req.error(err);
                }
            }
            console.log(rs);
            console.log("Ok");
            return "Success";
        } catch (error) {
            console.error(error)
            return;
        }
    });

    srv.on('validCategories', async (req) => {
        let tx = cds.transaction(req);
        const programUuid = req.data.programUuid;
        //const programUuid = req.data;
        //const { PROG_CATEGORY, CATEGORY_NAME } = cds.entities("ProgramAdmin");
        const service = await cds.connect.to('BookingProgram');
        const { ProgramCategorySet } = service.entities;
        //Added DONOTTRANSPORT as 'null'
        const query = await tx.run(SELECT.from(ProgramCategorySet).columns('CATEGORY_ID').where({ and: { "PROGRAM_UUID": programUuid, "VALID": 'X', "DONOTTRANSPORT": { in: ['', 'NULL'] } } }).groupBy(`CATEGORY_ID`).orderBy(`CATEGORY_ID`));
        console.log(query);
        return query;

    });


    srv.on('readEntities', async (req) => {
        try {
            console.log("REQUESTDATA");
            console.log(req.data);
            let list = req.data.inData;
            console.log("__________________________");
            console.log(list);
            console.log("Hi Upload Delivery Location...");
            console.log("____________________________");
            let data1 = JSON.parse(list);
            console.log(data1);
            console.log("Hi1234");
            console.log(data1.results);
            console.log("here are results");
            //console.log(data1.results);
            let res = data1.results;
            console.log("Results.....");
            console.log(res)
            let tx = cds.transaction(req);
            for (i = 0; i < res.length; i++) {
                try {
                    let programUuid = res[i].PROGRAM_UUID;
                    let dealerCode = req.data.dealerCode;//res[i].DEALER_CODE;
                    let categoryId = res[i].CATEGORY_ID;
                    let vendorId = res[i].VENDOR_ID;
                    let lang = res[i].LANGUAGE_KEY;
                    let DEL_METHOD = res[i].DEL_METHOD;
                    let OBJECT_KEY = res[i].DEL_LOCATION_UUID;
                    console.log("programUuid");
                    console.log(programUuid);
                    console.log("dealerCode");
                    console.log(dealerCode);
                    console.log("categoryId");
                    console.log(categoryId);
                    console.log("vendorId");
                    console.log(vendorId);
                    console.log("lang");
                    console.log(lang);
                    console.log("DEL_METHOD");
                    console.log(DEL_METHOD);
                    console.log("DEL_LOCATION_UUID");
                    console.log(OBJECT_KEY);
                    const service = await cds.connect.to('BookingProgram');
                    const { DealerBookingCategoryDeliveryScheduleSet, ProgramValidDeliveryMethodLangSet, DeliveryMethodNameSet, ProgramDeliveryLocationLangSet } = service.entities;
                    const query1 = await tx.run(SELECT.from(DealerBookingCategoryDeliveryScheduleSet).where({ and: { "PROGRAM_UUID": programUuid, "DEALER_CODE": dealerCode, "CATEGORY_ID": categoryId, "VENDOR_ID": vendorId } }));
                    console.log(query1);
                    console.log("DealerBookingCategoryDeliveryScheduleSet");
                    let to_DealerBookingCategoryDeliverySchedule = {};
                    to_DealerBookingCategoryDeliverySchedule.results = query1;
                    res[i].to_DealerBookingCategoryDeliverySchedule = to_DealerBookingCategoryDeliverySchedule;
                    const query2 = await tx.run(SELECT.from(ProgramValidDeliveryMethodLangSet).where({ and: { "PROGRAM_UUID": programUuid, "LANGUAGE_KEY": lang, "CATEGORY_ID": categoryId, "VENDOR_ID": vendorId } }));
                    console.log(query2);
                    let to_DeliveryMethodSet = {};
                    to_DeliveryMethodSet.results = query2;
                    res[i].to_DeliveryMethodSet = to_DeliveryMethodSet;
                    const query3 = await tx.run(SELECT.from(DeliveryMethodNameSet).where({ and: { "DEL_METHOD": DEL_METHOD, "LANGUAGE_KEY": lang } }));
                    console.log(query3);
                    let to_DeliveryMethodName = {};
                    to_DeliveryMethodName.results = query3;
                    res[i].to_DeliveryMethodName = to_DeliveryMethodName;
                    const query4 = await tx.run(SELECT.from(ProgramDeliveryLocationLangSet).where({ and: { "OBJECT_KEY": OBJECT_KEY, "LANGUAGE_KEY": lang } }));
                    console.log("Query4");
                    console.log(query4);
                    let to_DeliveryLocation = {};
                    res[i].to_DeliveryLocation = to_DeliveryLocation;
                    to_DeliveryLocation.results = query4;
                    console.log("Iteration " + i);
                    console.log("Printing Res after querying");
                    console.log(res);
                } catch (err) {
                    return req.error(err);
                }
            }
            console.log("Queries done Returning data.....");
            console.log(res);
            let res1 = {};
            res1.results = res;
            // let res1 = JSON.stringify(res);
            // console.log("Strigify");
            // console.log(res1);
            return res1;
        }
        catch (error) {
            return req.error(error);
        }
    });

}