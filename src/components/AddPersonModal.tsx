import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema, type PersonFormValues } from "../validator";



interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (person: PersonFormValues) => void;
}

const AddPersonModal: React.FC<Props> = ({ open, onClose, onAdd }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
  });

  const onSubmit = (data: PersonFormValues) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Person</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Language"
            fullWidth
            margin="dense"
            select
            {...register("language")}
            error={!!errors.language}
            helperText={errors.language?.message}
          >
            {["English", "Sindhi", "Vietnamese"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Bio"
            fullWidth
            margin="dense"
            {...register("bio")}
          />
          <TextField
            label="Version"
            type="number"
            fullWidth
            margin="dense"
            {...register("version", { valueAsNumber: true })}
            error={!!errors.version}
            helperText={errors.version?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPersonModal;
