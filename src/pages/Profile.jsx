import { useEffect, useState } from "react";

import {
  Box,
  Card,
  Typography,
  Avatar,
  TextField,
  Button,
  Chip,
} from "@mui/material";

import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [edit, setEdit] =
    useState(false);

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const res =
          await api.get(
            "/auth/me"
          );

        setUser(
          res.data.user
        );
      } catch (err) {
        console.log(err);
      }
    };

  const handleChange = (
    e
  ) => {
    setUser({
      ...user,
      [e.target.name]:
        e.target.value,
    });
  };

  const updateProfile =
    async () => {
      try {
        const res =
          await api.put(
            "/auth/update-profile",
            {
              firstName:
                user.firstName,
              lastName:
                user.lastName,
              email:
                user.email,
              phone:
                user.phone,
            }
          );

        setUser(
          res.data.user
        );

        localStorage.setItem(
          "name",
          res.data.user
            .firstName
        );

        setEdit(false);

        alert(
          "Profile Updated"
        );
      } catch (err) {
        console.log(err);
      }
    };

  const handleImage =
    (e) => {
      const file =
        e.target.files[0];

      setImage(file);

      setPreview(
        URL.createObjectURL(
          file
        )
      );
    };

  const uploadImage =
    async () => {
      try {
        const fd =
          new FormData();

        fd.append(
          "image",
          image
        );

        const res =
          await api.put(
            "/auth/upload-profile",
            fd,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setUser(
          res.data.user
        );

        setPreview("");
      } catch (err) {
        console.log(err);
      }
    };

  if (!user)
    return (
      <Typography p={4}>
        Loading...
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight:
          "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        background:
          "linear-gradient(135deg,#f6efe9,#f1e3db)",
      }}
    >
      <Card
        sx={{
          width: 700,
          p: 4,
          borderRadius: 5,
        }}
      >
        <Box
          textAlign="center"
        >
          <Avatar
            src={
              preview ||
              user.profileImage
            }
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              bgcolor:
                "#c186e9",
            }}
          >
            {user.firstName?.charAt(
              0
            )}
          </Avatar>

          <Typography
            mt={2}
            variant="h5"
            fontWeight="bold"
          >
            {
              user.firstName
            }{" "}
            {
              user.lastName
            }
          </Typography>

          <Chip
            label={
              user.role
            }
            sx={{
              mt: 1,
            }}
          />
        </Box>

        <Box mt={4}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={
              user.firstName
            }
            disabled={
              !edit
            }
            onChange={
              handleChange
            }
            sx={{
              mb: 2,
            }}
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={
              user.lastName
            }
            disabled={
              !edit
            }
            onChange={
              handleChange
            }
            sx={{
              mb: 2,
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={
              user.email
            }
            disabled={
              !edit
            }
            onChange={
              handleChange
            }
            sx={{
              mb: 2,
            }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={
              user.phone
            }
            disabled={
              !edit
            }
            onChange={
              handleChange
            }
            sx={{
              mb: 2,
            }}
          />

          <input
            type="file"
            onChange={
              handleImage
            }
          />

          {image && (
            <Button
              sx={{
                mt: 2,
              }}
              variant="contained"
              onClick={
                uploadImage
              }
            >
              Upload Image
            </Button>
          )}

          <Box mt={3}>
            {!edit ? (
              <Button
                variant="contained"
                onClick={() =>
                  setEdit(
                    true
                  )
                }
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={
                  updateProfile
                }
              >
                Save Changes
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}