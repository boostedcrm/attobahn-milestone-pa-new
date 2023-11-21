import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import PORequestForm from "./Components/PORequestForm";
import logo from "./auttobahn.png";
const ZOHO = window.ZOHO;

function App() {
  const [initailLoading, setInitialLoading] = useState(false);
  const [zohoInitialized, setZohoInitialized] = useState(false);
  const [prevPoRequest, setPrevPoRequest] = useState(null);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", async function (data) {
      // console.log(data);
      setInitialLoading(true);
      await ZOHO.CRM.API.getRecord({
        Entity: data?.Entity,
        RecordID: data?.EntityId,
      }).then(async function (data) {
        setPrevPoRequest(data?.data[0]);
        setInitialLoading(false);
      });

      ZOHO.CRM.UI.Resize({ height: "1200", width: "1500" }).then(function (
        data
      ) {
        // console.log(data);
      });
    });

    ZOHO.embeddedApp.init().then(() => {
      setZohoInitialized(true);
    });
  }, []);

  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [name, setName] = useState("");
  const [recordResp, setRecordResp] = useState();
  const [milestoneType, setMileStoneType] = useState("");
  const [prevMilestones, setPrevMilestones] = useState([]);
  const [prevMilestonesTotal, setPrevMilestonesTotal] = useState([]);
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState(0);
  const [status, setStatus] = useState("Open");

  const [targetDate, setTargetDate] = useState(null); // State for Target Date

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", async function (data) {
      console.log(data.EntityId);
      setRecordId(data.EntityId);
      await ZOHO.CRM.API.getRecord({
        Entity: data?.Entity,
        RecordID: data?.EntityId,
      }).then(async function (data) {
        console.log(data?.data[0]);
        setRecordResp(data?.data[0]);
      });

      await ZOHO.CRM.API.getRelatedRecords({
        Entity: data?.Entity,
        RecordID: data?.EntityId,
        RelatedList: "Milestone",
        page: 1,
        per_page: 200,
      }).then(function (data) {
        setPrevMilestones(data?.data || []);
        let total = data?.data?.reduce((accumulator, currentObj) => {
          return accumulator + currentObj.Fee;
        }, 0);
        setPrevMilestonesTotal(total);
        // setTaskList(data?.data || []);
      });
    });

    ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
    });
  }, []);

  const handleSubmit = async () => {
    // if(startDate !== null){

    // }

    const target_Date = targetDate.format("YYYY-MM-DD");
    const finalObject = {
      Name: "Test Name 123",
      Start: start,
      End: end,
      Milestone_Description: description,
      Fee: fee,
      Project_Assignment: { id: recordId },
      Status: "Open",
      Target_Date: target_Date,
      Blueprint_Status: "Start",
    };

    await ZOHO.CRM.API.insertRecord({
      Entity: "Milestones",
      APIData: finalObject,
      Trigger: ["workflow"],
    }).then(function (data) {
      console.log(data?.data[0]?.status);
      if (data?.data[0]?.status === "success") {
        ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
          console.log(data);
        });
      }
    });
  };

  const handleClose = async () => {
    await ZOHO.CRM.UI.Popup.close().then(function (data) {
      console.log(data);
    });
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onSelect = (value) => {
    setAnchorEl(null);
    // You can handle the selected value here
    setMileStoneType(value);
    console.log(value);
  };

  return (
    <>
      <Box>
        {initailLoading ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 13,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mt: 1, textAlign: "center", mb: 3 }}>
              <img src={logo} alt="logo" />
            </Box>
            {recordResp?.Fee_Type === "Fixed Fee by Milestone" && (
              <Box>
                Previous Total Milestones Amount: ${prevMilestonesTotal}
              </Box>
            )}
            <PORequestForm
              prevPoRequest={prevPoRequest}
              recordResp={recordResp}
            />
          </>
        )}
      </Box>
    </>
  );
}

export default App;
