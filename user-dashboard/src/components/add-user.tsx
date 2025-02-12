import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack
} from '@mui/joy';

const AddUser = ({
  isOpen,
  onDialogSwitch,
  addUser,
}: {
  isOpen: boolean;
  onDialogSwitch: () => void;
  addUser: (body: {name: string, email: string, age: string | number }) => void
}) => {

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    age: ''
  });

  const handleUserDetailsInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <React.Fragment>
      <Modal open={isOpen} onClose={() => onDialogSwitch()}>
        <ModalDialog>
          <DialogTitle>Create new user</DialogTitle>
          <DialogContent>Fill in the information of the user.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              onDialogSwitch();
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  required
                  name='name'
                  onChange={handleUserDetailsInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  required
                  name='email'
                  onChange={handleUserDetailsInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input required name='age' type='number' onChange={handleUserDetailsInput} />
              </FormControl>
              <Button
                type='submit'
                onClick={() => addUser(userDetails)}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default AddUser;
