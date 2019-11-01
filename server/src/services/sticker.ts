
const data = new Map<string, Sticker[]>()

export interface Sticker {
    src: string;
    id: string;
    name?: string;
}

/**
 * 获取用户表情
 * @param id 
 */
export function getUserStickers(id: string): Promise<Sticker[]> {
    return data.has(id) ? Promise.resolve(data.get(id)!) : Promise.reject('not found');
}

function filterUserStickers(id: string, stickers: Pick<Sticker, 'name' | 'src'>[]): Promise<Pick<Sticker, 'name' | 'src'>[]> {
    return getUserStickers(id)
        .catch(() => [] as Sticker[])
        .then(allStickers => stickers.filter(s => !allStickers.find(all => all.src === s.src)));
}

/**
 * 添加用户表情
 * @param id 
 * @param stickers 
 */
export function addUserStickers(id: string, stickers: Pick<Sticker, 'name' | 'src'>[]): Promise<Sticker[]> {
    if (!id || !stickers || stickers.length === 0) {
        return Promise.reject()
    }
    return filterUserStickers(id, stickers).then(s => {
        const saveStickers: Sticker[] = s.map(i => ({ ...i, id: '' + Math.random() }));
        data.set(id, [...saveStickers, ...data.get(id) || []])
        return saveStickers;
    });
}