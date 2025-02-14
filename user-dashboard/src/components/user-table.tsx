import { Button, Typography } from '@mui/joy';
import Table from '@mui/joy/Table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UserDetails } from '../user-interface';
import { BASE_API_URL } from '../constant';

const UserDataTable = () => {
  const queryClient = useQueryClient();
  const { isPending, data, error } = useQuery({
    queryKey: ['getusers'],
    queryFn: () => fetch(BASE_API_URL).then((res) => res.json())
  });

  const deleteUser = useMutation({
    mutationFn: (user_id: number) => axios.delete(`${BASE_API_URL}/${user_id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getusers'] })
  });

  if (isPending) {
    return <p>Data is loading...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  return (
    <>
      {data.length ? (
        <Table aria-label='basic table' variant='outlined'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user: UserDetails) => (
              <tr
                style={{
                  textAlign: 'left'
                }}
              >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      color='danger'
                      variant='soft'
                      onClick={() => deleteUser.mutate(user?.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Typography>
          No users available at this moment, please try adding some users data
          by clicking on Add Users button
        </Typography>
      )}
    </>
  );
};

export default UserDataTable;
