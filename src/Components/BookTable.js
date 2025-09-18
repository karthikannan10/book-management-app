import React, { useState } from "react";
import {
    Table, TableHead, TableBody, TablePagination,
    IconButton, TextField, Button,
    Grid, Dialog, DialogTitle, DialogActions,
    Skeleton,
    Autocomplete,
    Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getBooks, deleteBook } from "../Apis/BookApis";
import SetupForm from "./SetupForm";
import { BookTableCell, BookTableRow } from "../Pages/Widgets/BookTableStyle";
import toast from "react-hot-toast";

const statuses = ["Available", "Issued"];

const BookTable = () => {
    const queryClient = useQueryClient();
    const { data: books, isLoading } = useQuery("books", getBooks);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [editBook, setEditBook] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const deleteMutation = useMutation(deleteBook, {
        onSuccess: () => {
            queryClient.invalidateQueries("books");
            setDeleteDialogOpen(false);
            toast.success("Book deleted successfully")
        },
        onError: () => toast.error("Error deleting book"),
    });

    const handleChangePage = (e, newPage) => setPage(newPage);

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (bookToDelete) {
            deleteMutation.mutate(bookToDelete?.id);
            setBookToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setBookToDelete(null);
    };

    const filteredBooks = books?.filter(
        (b) =>
            (b.title?.toLowerCase().includes(search.toLowerCase()) ||
                b.author?.toLowerCase().includes(search.toLowerCase())) &&
            (statusFilter ? b.status === statusFilter : true)
    );

    return (
        <div>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setEditBook(null); setOpenForm(true); }}
                >
                    Add Book
                </Button>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or author"
                        size="small"
                        fullWidth
                    />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Autocomplete
                        value={statusFilter || null}
                        options={statuses}
                        getOptionLabel={(option) => option || ""}
                        onChange={(e, value) => setStatusFilter(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Filter by status"
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {/* Table */}
            <Box sx={{ p: 2, height: 450, mt: 2, overflowX: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <BookTableRow>
                            <BookTableCell>Title</BookTableCell>
                            <BookTableCell>Author</BookTableCell>
                            <BookTableCell>Genre</BookTableCell>
                            <BookTableCell>Year</BookTableCell>
                            <BookTableCell>Status</BookTableCell>
                            <BookTableCell>Actions</BookTableCell>
                        </BookTableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            Array.from(new Array(10)).map((_, i) => (
                                <BookTableRow key={i}>
                                    <BookTableCell><Skeleton /></BookTableCell>
                                    <BookTableCell><Skeleton /></BookTableCell>
                                    <BookTableCell><Skeleton /></BookTableCell>
                                    <BookTableCell><Skeleton /></BookTableCell>
                                    <BookTableCell><Skeleton /></BookTableCell>
                                    <BookTableCell><Skeleton /></BookTableCell>
                                </BookTableRow>
                            ))
                        ) : (
                            filteredBooks?.slice(page * 10, page * 10 + 10)?.map((book) => (
                                <BookTableRow key={book.id}>
                                    <BookTableCell>{book?.title}</BookTableCell>
                                    <BookTableCell>{book?.author}</BookTableCell>
                                    <BookTableCell>{book?.genre}</BookTableCell>
                                    <BookTableCell>{book?.publishedYear}</BookTableCell>
                                    <BookTableCell>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "12px",
                                                color: book.status === "Available" ? "green" : "red",
                                                backgroundColor: book.status === "Available" ? "#d4edda" : "#f8d7da",
                                                fontWeight: 500,
                                                display: "inline-block",
                                                minWidth: 60,
                                                textAlign: "center",
                                            }}
                                        >
                                            {book?.status}
                                        </span>
                                    </BookTableCell>

                                    <BookTableCell>
                                        <IconButton onClick={() => { setEditBook(book); setOpenForm(true); }}>
                                            <EditDocumentIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(book)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </BookTableCell>
                                </BookTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Box>

            <TablePagination
                component="div"
                count={filteredBooks?.length || 0}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[10]}
            />

            {openForm && (
                <SetupForm
                    open={openForm}
                    handleClose={() => setOpenForm(false)}
                    book={editBook}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
                <DialogActions>
                    <Button variant="contained" onClick={handleCancelDelete}>No</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BookTable;
