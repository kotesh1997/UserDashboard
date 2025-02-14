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
  Stack,
  FormHelperText,
  Snackbar
} from '@mui/joy';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { UserDetails } from '../user-interface';
import { BASE_API_URL } from '../constant';

const AddUser = ({
  isOpen,
  onDialogSwitch
}: {
  isOpen: boolean;
  onDialogSwitch: () => void;
}) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const queryClient = useQueryClient();
  const [isApiError, setIsApiError] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    age: ''
  });

  const [userDetailsError, setUserDetailsError] = useState({
    name: { isTouched: false, hasError: false },
    email: { isTouched: false, hasError: false }
  });

  const { mutate: addUser } = useMutation({
    mutationFn: (user: Omit<UserDetails, 'id'>) =>
      axios.post(`${BASE_API_URL}/`, user),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getusers'] });
        onDialogSwitch();
    },
    onError: (error: AxiosError) => {
      console.error('Something went wrong', error);
      setIsApiError(true);
    }
  });

  const isDisabled = () => {
    return (
      userDetails.name.length >= 2 &&
      emailRegex.test(userDetails.email) &&
      !!userDetails.age
    );
  };

  const validateField = (field: string, value: string) => {
    if (field === 'email') return !emailRegex.test(value);
    return value.length < 3;
  };

  const onBlur = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = event.target.value;

    setUserDetailsError((prev) => ({
      ...prev,
      [field]: {
        isTouched: true,
        hasError: validateField(field, value)
      }
    }));
  };

  const handleUserDetailsInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value
    }));

    if (userDetailsError[name as keyof typeof userDetailsError]?.isTouched) {
      setUserDetailsError((prev) => ({
        ...prev,
        [name]: {
          ...prev[name as keyof typeof userDetailsError],
          hasError: validateField(name, value)
        }
      }));
    }
  };

  return (
    <>
      <Modal open={isOpen} onClose={() => onDialogSwitch()}>
        <ModalDialog>
          <DialogTitle>Create new user</DialogTitle>
          <DialogContent>Fill in the information of the user.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              addUser(userDetails);
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
                  onBlur={(event) => onBlur(event, 'name')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  startDecorator={<EmailOutlinedIcon />}
                  required
                  name='email'
                  onChange={handleUserDetailsInput}
                  onBlur={(event) => onBlur(event, 'email')}
                />
                {userDetailsError.email.isTouched &&
                  userDetailsError.email.hasError && (
                    <FormHelperText style={{ color: 'red' }}>
                      Please enter a valid email format
                    </FormHelperText>
                  )}
              </FormControl>
              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input
                  required
                  name='age'
                  type='number'
                  onChange={handleUserDetailsInput}
                />
              </FormControl>
              <Button type='submit' disabled={!isDisabled()}>
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
          <Snackbar
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            autoHideDuration={4000}
            open={isApiError}
            variant={'soft'}
            color={'danger'}
            onClose={(_, reason) => {
              if (reason === 'clickaway') {
                return;
              }
              setIsApiError(false);
            }}
          >
            Something went wrong with the user Inputs, please re-verify your data.
          </Snackbar>
    </>
  );
};

export default AddUser;
