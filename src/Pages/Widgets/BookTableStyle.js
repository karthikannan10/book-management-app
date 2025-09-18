import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const BookTableCell = styled(TableCell)(({ theme }) => ({
    position: "relative",

    [`&.${tableCellClasses.head}`]: {
        cursor: "pointer",
        flexWrap: "nowrap",
        padding: "0px 10px !important",
        fontSize: "14px !important",
        backgroundColor: "#e2f1ff !important",
        color: "#0b0f30 !important",
        fontWeight: "500",
        boxShadow: "none",
    },

    [`&.${tableCellClasses.body}`]: {
        boxShadow: "none",
        fontSize: "14px !important",
        fontWeight: "400 !important",
        padding: "0px 10px !important",
        color: "#2b2d3b !important",
        margin: "0px !important",
        position: "relative",

        // Hover icon container default hidden
        "& .hover-icons": {
            display: "none",
            position: "absolute",
            top: "50%",
            right: "8px",
            transform: "translateY(-50%)",
            gap: "8px",
            backgroundColor: "#fff", // optional
            padding: "2px 4px",
            borderRadius: "4px",
            zIndex: 1,
        },

        // Show icons on hover
        "&:hover .hover-icons": {
            display: "flex",
        },
    },

    [`&.${tableCellClasses.numeric}`]: {
        boxShadow: "none",
        fontSize: "14px !important",
        fontWeight: "400 !important",
        padding: "0px 10px !important",
        textAlign: "right",
    },
}));


export const BookTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": {
        backgroundColor: "#F3F3F3",
    },
    // hide last border
    "td, th": {
        border: "0px solid !important",
        height: "40px !important",
        padding: "0px !important",
        paddingX: "10px !important",
    },
}));
