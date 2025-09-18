import React from "react";
import { Container, Typography } from "@mui/material";
import BookTable from "../../Components/BookTable";

const BookDashboard = () => {


    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Book Dashboard
            </Typography>

            <BookTable />
        </Container>
    );
};

export default BookDashboard;
