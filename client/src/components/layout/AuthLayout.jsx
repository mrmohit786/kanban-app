import { Box, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import assets from "../../assets";

const AuthLayout = () => {
  const navigtate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
      } else {
        navigtate("/");
      }
    };
    checkAuth();
  }, [navigtate]);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src={assets.images.logoDark}
          style={{ width: "100px" }}
          alt="kanban app logo"
        />
        <Outlet />
      </Box>
    </Container>
  );
};

export default AuthLayout;
