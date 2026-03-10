import Add from "@mui/icons-material/Add";
import Download from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import {
    useState
} from "react";
import {
    RgbColorPicker,
    type RgbColor
} from "react-colorful";
import defaultPalette from "./defaultPalette.json";
import allPossibleBlocks from "./allPossibleBlocks.json";
import colorizer from "./colorizer.js?raw";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

/**
 * It is an object because sometimes we need to change its ID without changing its color.
 */
interface block {
    id: string;
    color: RgbColor;
};

const drawerWidth = 250;

export default function App() {
    const [blocks, setBlocks] = useState<block[]>(defaultPalette);
    return <>
        <Grid container sx={{
            p: 1,
            paddingRight: `${drawerWidth}px` // must use px or it will be dp
        }} rowSpacing={2} columnSpacing={2}>
            {blocks.map((block, index) => <Grid>
                <Paper sx={{
                    p: 1
                }} elevation={3}>
                    <FormControl fullWidth>
                        <InputLabel id="id-select-label">
                            ID
                        </InputLabel>
                        <Select labelId="id-select-label" label="ID" onChange={event => setBlocks(oldBlocks => {
                            const buffer = oldBlocks.slice();
                            buffer[index].id = event.target.value;
                            return buffer;
                        })} id="id-select" value={block.id}>
                            {allPossibleBlocks.map(possibleBlock => <MenuItem value={possibleBlock}>
                                {possibleBlock}
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                    <RgbColorPicker color={block.color} onChange={newColor => setBlocks(oldBlocks => {
                        const buffer = oldBlocks.slice();
                        buffer[index].color = newColor;
                        return buffer;
                    })} />
                    <IconButton color="error" onClick={() => setBlocks(oldBlocks => {
                        const buffer = oldBlocks.slice();
                        buffer.splice(index, 1);
                        return buffer;
                    })}>
                        <Delete />
                    </IconButton>
                </Paper>
            </Grid>)}
        </Grid>
        <Fab sx={{
            position: "fixed",
            bottom: 16,
            right: 16 + 250
        }} color="primary" onClick={() => setBlocks([...blocks, {
            id: "Custom1",
            color: {
                r: 57,
                g: 56,
                b: 63
            }
        }])}>
            <Add />
        </Fab>
        <Drawer sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: 250,
                p: 1,
                boxSizing: "border-box"
            }
        }} variant="permanent" anchor="right">
            <ButtonGroup variant="contained" fullWidth>
                <Button startIcon={<Download />} onClick={() => {
                    const blob = new Blob([
                        colorizer.replace("_def_", JSON.stringify(blocks.map(block => [
                            block.id,
                            block.color.r,
                            block.color.g,
                            block.color.b
                        ].join(" ")))).replace("_allPossibleBlocks_", JSON.stringify(allPossibleBlocks))
                    ]);
                    const objectUrl = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = objectUrl;
                    link.download = "colorizer.js";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(objectUrl); // 清理资源
                }}>
                    下载脚本
                </Button>
            </ButtonGroup>
        </Drawer>
    </>;
};
