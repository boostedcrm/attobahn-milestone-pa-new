import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TableBody,
  Snackbar,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import TableCell from "@mui/material/TableCell/TableCell";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MuiAlert from "@mui/material/Alert";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextFieldWithStyle from "./TextFieldWithStyle";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ZOHO = window.ZOHO;

function PORequestForm({ prevPoRequest, recordResp }) {
  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      Line_Items: [
        {
          Item_Name: "",
          Quantity: 1,
          Unit_Price: "",
          Unit_Total: "",
        },
      ],
    },
  });

  const watchAllFields = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "Line_Items",
  });

  useEffect(() => {
    if (prevPoRequest) {
      setValue(
        "Line_Items",
        prevPoRequest?.Line_Items?.length
          ? prevPoRequest?.Line_Items
          : [
              {
                Item_Name: "",
                Quantity: 1,
                Unit_Price: "",
                Unit_Total: "",
              },
            ]
      );
    }
  }, [prevPoRequest]);

  const onSubmit = async (data) => {
    console.log(data);
    // setLoading(true);
    // let addedLineItems = data?.Line_Items?.map((item) => {
    //   item.Quantity = item.Quantity.toString();
    //   return item;
    // });

    // try {
    //   var config = {
    //     Entity: "PO_Requests",
    //     APIData: {
    //       id: prevPoRequest?.id,
    //       Line_Items: addedLineItems,
    //     },
    //     Trigger: ["workflow"],
    //   };
    //   console.log(config);

    //   ZOHO.CRM.API.updateRecord(config).then(async function (data) {
    //     if (data?.data[0]?.message === "record updated") {
    //       setLoading(false);
    //       ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
    //         console.log(data);
    //       });
    //     } else {
    //       setLoading(false);
    //       setSnackbarMessage("Error....Please try later");
    //       setSeverity("error");
    //       setOpenSnackbar(true);
    //     }
    //   });
    // } catch (error) {
    //   setLoading(false);
    //   setSnackbarMessage(error?.message);
    //   setSeverity("error");
    //   setOpenSnackbar(true);
    // }
  };

  return (
    <Box>
      <Box sx={{ my: 1, mx: 2, p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <TableContainer sx={{ my: 0.5, maxHeight: 350 }} component={Paper}>
              <Table
                size="small"
                sx={{ minWidth: 700 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ px: 1, fontWeight: "bold" }}>
                      Milestone Type
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ px: 1, width: 100, fontWeight: "bold" }}
                    >
                      Target Date
                    </TableCell>

                    {recordResp?.Fee_Type === "Fixed Fee by Milestone" && (
                      <TableCell
                        align="center"
                        sx={{ px: 1, width: 100, fontWeight: "bold" }}
                      >
                        Start %
                      </TableCell>
                    )}
                    {recordResp?.Fee_Type === "Fixed Fee by Milestone" && (
                      <TableCell
                        align="center"
                        sx={{ px: 1, minWidth: 100, fontWeight: "bold" }}
                      >
                        End %
                      </TableCell>
                    )}
                    <TableCell
                      align="center"
                      sx={{ px: 1, minWidth: 100, fontWeight: "bold" }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ px: 1, minWidth: 100, fontWeight: "bold" }}
                    >
                      Fee
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: 10, pl: 0, pr: 0.5 }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow
                      key={field.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell sx={{ px: 1 }} component="th" scope="row">
                        <Controller
                          name={`Line_Items.${index}.Item_Name`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextFieldWithStyle  {...field} /> );
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ px: 1 }} align="right">
                        <Controller
                          name="dob"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                {...field}
                                label="Target Date"
                                inputFormat="MM/dd/yyyy"
                                // sx={{ width: "100%" }}
                                sx={{
                                  borderLeft: "3px solid red",
                                  width: "100%",
                                  height: "50px",
                                  borderRadius: "8px",
                                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderLeftColor: "transparent",
                                    },
                                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderLeftColor: "transparent",
                                    },
                                }}
                                inputProps={{
                                  style: {
                                    textAlign: "right",
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} sx={{border: "none"}} />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </TableCell>
                      {recordResp?.Fee_Type === "Fixed Fee by Milestone" && (
                        <TableCell sx={{ px: 1 }} align="right">
                          <Controller
                            render={({ field }) => {
                              return (
                                <TextFieldWithStyle  {...field} />
                              );
                            }}
                            name={`Line_Items.${index}.Quantity`}
                            control={control}
                          />
                        </TableCell>
                      )}
                      {recordResp?.Fee_Type === "Fixed Fee by Milestone" && (
                        <TableCell sx={{ px: 1 }} align="right">
                          <Controller
                            render={({ field }) => {
                              return (
                                <TextFieldWithStyle  {...field} />
                              );
                            }}
                            name={`Line_Items.${index}.Unit_Price`}
                            control={control}
                          />
                        </TableCell>
                      )}

                      <TableCell sx={{ px: 1 }} align="right">
                        <Controller
                          render={({ field }) => {
                            return (
                              <TextFieldWithStyle  {...field} />
                            );
                          }}
                          name={`Line_Items.${index}.Unit_Price`}
                          control={control}
                        />
                      </TableCell>
                      <TableCell sx={{ px: 1 }} align="right">
                        {" "}
                        <Controller
                          render={({ field }) => {
                            return (
                              <TextFieldWithStyle  {...field} />
                            );
                          }}
                          name={`Line_Items.${index}.Unit_Price`}
                          control={control}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ width: 10, pl: 0, pr: 0.5 }}
                      >
                        <HighlightOffIcon
                          onClick={() => remove(index)}
                          sx={{
                            pointerEvents: fields.length === 1 && "none",
                            "&:hover": {
                              cursor: fields.length > 1 && "pointer",
                            },
                            color: "#ed2f4f",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() =>
                  append({
                    Item_Name: "",
                    Quantity: 1,
                    Unit_Price: "",
                    Unit_Total: "",
                  })
                }
                variant="contained"
                sx={{
                  bgcolor: "#dee0e0",
                  height: "37px !important",
                  color: "black",
                  "&:hover": { bgcolor: "#dee0e0", color: "black" },
                }}
              >
                <AddCircleIcon
                  sx={{ color: "#2196f3", fontSize: 18, mr: 0.5 }}
                />{" "}
                Add Another Line
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 10,
              right: 10,
            }}
          >
            <Button
              sx={{ width: 150, mr: 2 }}
              size="small"
              variant="contained"
              onClick={() =>
                ZOHO.CRM.UI.Popup.close().then(function (data) {
                  console.log(data);
                })
              }
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              sx={{ width: 150 }}
              size="small"
              variant="contained"
              type="submit"
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3800}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default React.memo(PORequestForm);
