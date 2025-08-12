import { StickerColor } from "./colors";
import { PoolVersion, SelectorFlag, TokenSource } from "../types/token";

export type CheckList = {
    label: string;
    value: SelectorFlag;
    color?: 'green' | 'yellow' | 'red' | 'gray';
}
export type TCheckListItem<T> = { label: T; value: T; color: StickerColor };


export const checkListFlags: CheckList[] = [
    { label: "TRUSTED", value: SelectorFlag.TRUSTED, color: "green" },
    { label: "SUSPICIOUS", value: SelectorFlag.SUSPICIOUS, color: "yellow" },
    { label: "SCAM", value: SelectorFlag.SCAM, color: "red" },
    { label: "GRAYSCALE", value: SelectorFlag.GRAYSCALE, color: "gray" },
]

export const tokenSourceColorSet: Record<string, StickerColor> = {
    [TokenSource.SELF_DEPLOYED]: 'gray',
    [TokenSource.FLAUNCH]: 'plum',
    [TokenSource.VIRTUALS]: 'grass',
    [TokenSource.CLIZA]: 'ruby',
    [TokenSource.ZORA]: 'amber',
    [TokenSource.CLANKER]: 'teal',
    [TokenSource.PINKSALE]: 'pink',
    [TokenSource.WORMHOLE]: 'sky',
    [TokenSource.UNKNOWN]: 'gray',
    [TokenSource.APESTORE]: 'orange',
    [TokenSource.KOATOLOCKER]: 'teal',
    [TokenSource.NONAME1]: 'iris',
    [TokenSource.NONAME2]: 'cyan',
};

export const tokenSourceCheckList: TCheckListItem<TokenSource>[] = [
    { label: TokenSource.SELF_DEPLOYED, value: TokenSource.SELF_DEPLOYED, color: "gray" },
    { label: TokenSource.FLAUNCH, value: TokenSource.FLAUNCH, color: "plum" },
    { label: TokenSource.VIRTUALS, value: TokenSource.VIRTUALS, color: "grass" },
    { label: TokenSource.CLIZA, value: TokenSource.CLIZA, color: "ruby" },
    { label: TokenSource.ZORA, value: TokenSource.ZORA, color: "amber" },
    { label: TokenSource.CLANKER, value: TokenSource.CLANKER, color: "teal" },
    { label: TokenSource.PINKSALE, value: TokenSource.PINKSALE, color: "pink" },
    { label: TokenSource.APESTORE, value: TokenSource.APESTORE, color: "orange" },
    { label: TokenSource.KOATOLOCKER, value: TokenSource.KOATOLOCKER, color: "teal" },
    { label: TokenSource.WORMHOLE, value: TokenSource.WORMHOLE, color: "sky" },
    { label: TokenSource.NONAME1, value: TokenSource.NONAME1, color: "iris" },
    { label: TokenSource.NONAME2, value: TokenSource.NONAME2, color: "cyan" },
]
export const poolVersionCheckList: TCheckListItem<PoolVersion>[] = [
    { label: PoolVersion.V2, value: PoolVersion.V2, color: "green" },
    { label: PoolVersion.V3, value: PoolVersion.V3, color: "blue" },
    { label: PoolVersion.V4, value: PoolVersion.V4, color: "purple" },
    { label: PoolVersion.NONE, value: PoolVersion.NONE, color: "gray" },
]
