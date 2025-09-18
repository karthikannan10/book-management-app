import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Autocomplete,
    FormControl,
    FormLabel,
    FormHelperText,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { createBook, updateBook } from "../Apis/BookApis";

const genres = [
    "Fiction", "Non-Fiction", "Sci-Fi", "Romance", "Horror",
    "Business", "Programming", "Self-help", "Productivity", "Finance", "History",
];
const statuses = ["Available", "Issued"];

const SetupForm = ({ open, handleClose, book }) => {
    const queryClient = useQueryClient();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            author: "",
            genre: null,
            publishedYear: "",
            status: null,
        },
    });

    // Create mutation
    const createMutation = useMutation(createBook, {
        onSuccess: () => {
            queryClient.invalidateQueries("books");
            toast.success("Book added successfully!");
            handleClose();
        },
        onError: () => toast.error("Error adding book"),
    });

    // Update mutation
    const updateMutation = useMutation(
        (data) => updateBook(book.id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("books");
                toast.success("Book updated successfully!");
                handleClose();
            },
            onError: () => toast.error("Error updating book"),
        }
    );

    useEffect(() => {
        if (book) {
            reset({
                ...book,
                publishedYear: Number(book?.publishedYear) || "",
                genre: book.genre || null,
                status: book.status || null,
            });
        } else {
            reset({
                title: "",
                author: "",
                genre: null,
                publishedYear: "",
                status: null,
            });
        }
    }, [book, reset]);

    const onSubmit = (data) => {
        const formattedData = { ...data, publishedYear: Number(data.publishedYear) };
        if (book) {
            const { id, ...updatePayload } = formattedData;
            updateMutation.mutate(updatePayload);
        } else {
            createMutation.mutate(formattedData);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{book ? "Edit Book" : "Add Book"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography>Title</Typography>

                    <TextField
                        {...register("title", { required: "Title is required" })}
                        margin="dense"
                        fullWidth
                        placeholder="Title"
                        size="small"
                        error={!!errors?.title}
                        helperText={errors?.title?.message}
                    />
                    <Typography>Author</Typography>

                    <TextField
                        {...register("author", { required: "Author is required" })}
                        placeholder="Author"
                        margin="dense"
                        fullWidth
                        size="small"
                        error={!!errors?.author}
                        helperText={errors?.author?.message}
                    />

                    <FormControl fullWidth margin="dense" error={!!errors?.genre}>
                        <FormLabel>Genre</FormLabel>
                        <Controller
                            name="genre"
                            control={control}
                            rules={{ required: "Genre is required" }}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    options={genres}
                                    value={field.value || null}
                                    onChange={(e, value) => field.onChange(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select Genre"
                                            size="small"
                                        />
                                    )}
                                />
                            )}
                        />
                        <FormHelperText>{errors.genre?.message}</FormHelperText>
                    </FormControl>

                    <Typography>Published Year</Typography>
                    <TextField
                        {...register("publishedYear", {
                            required: "Published Year is required",
                            valueAsNumber: true,
                            min: { value: 0, message: "Invalid year" },
                        })}
                        type="number"
                        margin="dense"
                        placeholder="Published Year"
                        fullWidth
                        size="small"
                        error={!!errors.publishedYear}
                        helperText={errors.publishedYear?.message}
                    />

                    <FormControl fullWidth margin="dense" error={!!errors.status}>
                        <FormLabel>Status</FormLabel>
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Status is required" }}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    options={statuses}
                                    value={field.value || null}
                                    onChange={(e, value) => field.onChange(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select Status"
                                            size="small"
                                        />
                                    )}
                                />
                            )}
                        />
                        <FormHelperText>{errors.status?.message}</FormHelperText>
                    </FormControl>

                    <DialogActions sx={{ mt: 2 }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {book ? "Update" : "Save"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SetupForm;
