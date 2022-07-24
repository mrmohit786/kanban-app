import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import StarOutlinedIcon from "@mui/icons-material/StarOutline";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EmojiPicker from "../components/common/EmojiPicker";
import { useDispatch, useSelector } from "react-redux";
import { setBoards } from "../redux/features/boardSlice";

let timer;
const timeout = 500;

const Board = () => {
  const dispatch = useDispatch();

  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [icon, setIcon] = useState("");
  const [isFavourite, setIsFavourite] = useState(false);

  const boards = useSelector((state) => state.board.value);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const { title, description, icon, sections, favourite } =
          await boardApi.getOne(boardId);
        setTitle(title);
        setDescription(description);
        setSections(sections);
        setIcon(icon);
        setIsFavourite(favourite);
      } catch (error) {
        alert(error);
      }
    };
    getBoard();
  }, [boardId]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };
    setIcon(newIcon);
    dispatch(setBoards(temp));
    try {
      await boardApi.update(boardId, { icon: newIcon });
    } catch (error) {
      alert(error);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };
    dispatch(setBoards(temp));
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (error) {}
    }, timeout);
  };

  const updateDescription = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);

    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], description: newDescription };
    dispatch(setBoards(temp));
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (error) {}
    }, timeout);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItem: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton variant="outlined">
          {isFavourite ? (
            <StarOutlinedIcon color="warning" />
          ) : (
            <StarBorderOutlinedIcon />
          )}
        </IconButton>
        <IconButton variant="outlined" color="error">
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: "10px 50px" }}>
        <Box>
          <EmojiPicker icon={icon} onChange={onIconChange} />
        </Box>
        <TextField
          value={title}
          placeholder="Untitled"
          variant="outlined"
          onChange={updateTitle}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
            "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "700" },
          }}
        />

        <TextField
          value={description}
          placeholder="Add a description"
          onChange={updateDescription}
          variant="outlined"
          multiline
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
            "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
          }}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between ",
            }}
          >
            <Button>Add section</Button>
            <Typography variant="body2" fontWeight={700}>
              {sections.length} Sections
            </Typography>
          </Box>
          <Divider sx={{ margin: "10px 0" }} />
          {/* Board */}
        </Box>
      </Box>
    </>
  );
};

export default Board;
