import Download from "@mui/icons-material/Download";
import FileOpen from "@mui/icons-material/FileOpen";
import Save from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import fileDownload from "js-file-download";
import {
    pickFile
    // @ts-expect-error js-pick-file don't have types or DefinitelyTyped.
} from "js-pick-file";
import {
    Fragment,
    useState
} from "react";
import {
    RgbColorPicker,
    type RgbColor
} from "react-colorful";
import allPossibleBlocks from "./allPossibleBlocks.json";
import colorizer from "./colorizer.js?raw";
import defaultPalette from "./defaultPalette.json";

const drawerWidth = 250,
    white = {
        r: 255,
        g: 255,
        b: 255
    } as const;

export default function App() {
    const [palette, setPalette] = useState<Record<string, RgbColor>>(defaultPalette),
        [editing, setEditing] = useState<string | false>(false),
        [editingColor, setEditingColor] = useState<RgbColor>(white),
        closeDialog = () => setEditing(false);
    return <>
        <List sx={{
            marginRight: `${drawerWidth}px` // must use px or it will be dp
        }}>
            {allPossibleBlocks.map(id => {
                const inPalette = Object.hasOwn(palette, id),
                    color = inPalette ? palette[id] : white;
                return <ListItem key={id} sx={{
                    p: 1
                }}>
                    <ListItemButton sx={{
                        bgcolor: `rgb(${color.r}, ${color.g}, ${color.b})`
                    }} onClick={() => {
                        setEditing(id);
                        setEditingColor(color);
                    }}>
                        <ListItemText primary={id} secondary={inPalette ? <Fragment /> : "未指定"} />
                    </ListItemButton>
                </ListItem>;
            })}
        </List>
        <Drawer sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box"
            }
        }} variant="permanent" anchor="right">
            <Box sx={{
                bottom: "0",
                position: "fixed",
                p: 1
            }}>
                <ButtonGroup variant="outlined" fullWidth sx={{
                    marginBottom: 1
                }}>
                    <Button startIcon={<FileOpen />} onClick={() => (pickFile({
                        accept: ".json",
                        multiple: false
                    }) as Promise<FileList>).then(list => list[0].text()).then(json => setPalette(JSON.parse(json)))}>
                        加载调色板
                    </Button>
                    <Button startIcon={<Save />} onClick={() => fileDownload(
                        JSON.stringify(palette),
                        "palette.json"
                    )}>
                        保存调色板
                    </Button>
                </ButtonGroup>
                <ButtonGroup variant="contained" fullWidth>
                    <Button startIcon={<Download />} onClick={() => fileDownload(
                        colorizer
                            .replace("_def_", JSON.stringify(Object.entries(palette).map(([id, color]) => [
                                id,
                                color.r,
                                color.g,
                                color.b
                            ].join(" "))))
                            .replace("_allPossibleBlocks_", JSON.stringify(allPossibleBlocks)),
                        "colorizer.js"
                    )}>
                        导出脚本
                    </Button>
                </ButtonGroup>
            </Box>
        </Drawer>

        <Dialog maxWidth="xs" open={editing !== false} keepMounted onClose={closeDialog}>
            <DialogTitle>
                编辑{editing}的颜色
            </DialogTitle>
            <DialogContent dividers>
                {editing !== false && <RgbColorPicker color={editingColor} onChange={newColor => setEditingColor(newColor)} />}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={closeDialog}>
                    取消
                </Button>
                {editing !== false && <Button onClick={() => {
                    setPalette(oldPalette => ({
                        ...oldPalette,
                        [editing]: editingColor
                    }));
                    closeDialog();
                }}>
                    确定
                </Button>}
            </DialogActions>
        </Dialog>
    </>;
};
