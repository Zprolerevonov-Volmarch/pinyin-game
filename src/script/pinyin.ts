// 定义每个拼音项的结构
export interface Pinyin {
    display: string; // 用于界面显示，例如 'ü'
    file: string;    // 用于文件名，例如 'v'
    category: 'shengmu' | 'yunmu' | 'zhengti'; // 分类
}

// 定义完整的数据结构
export const pinyinData = [
    {
        title: '声母',
        key: 'shengmu' as const, // 使用 as const 保证类型安全
        pinyins: [
            'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
            'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch',
            'sh', 'r', 'z', 'c', 's'
        ].map(p => ({display: p, file: p, category: 'shengmu' as const}))
    },
    {
        title: '韵母',
        key: 'yunmu' as const,
        pinyins: [
            {display: 'a', file: 'a'}, {display: 'o', file: 'o'}, {display: 'e', file: 'e'},
            {display: 'i', file: 'i'}, {display: 'u', file: 'u'}, {display: 'ü', file: 'v'},
            {display: 'ai', file: 'ai'}, {display: 'ei', file: 'ei'}, {display: 'ui', file: 'ui'},
            {display: 'ao', file: 'ao'}, {display: 'ou', file: 'ou'}, {display: 'iu', file: 'iu'},
            {display: 'ie', file: 'ie'}, {display: 'üe', file: 've'}, {display: 'er', file: 'er'},
            {display: 'an', file: 'an'}, {display: 'en', file: 'en'}, {display: 'in', file: 'in'},
            {display: 'un', file: 'un'}, {display: 'ün', file: 'vn'}, {display: 'ang', file: 'ang'},
            {display: 'eng', file: 'eng'}, {display: 'ing', file: 'ing'}, {display: 'ong', file: 'ong'}
        ].map(p => ({...p, category: 'yunmu' as const}))
    },
    {
        title: '整体认读音节',
        key: 'zhengti' as const,
        pinyins: [
            'yi', 'wu', 'yu', 'ye', 'yue', 'yin', 'yun',
            'yuan', 'ying', 'zi', 'ci', 'si', 'zhi', 'chi',
            'shi', 'ri'
        ].map(p => ({display: p, file: p, category: 'zhengti' as const}))
    }
];

// 导出一个扁平化的完整拼音列表，供游戏使用
// @ts-ignore
export const allPinyins: Pinyin[] = pinyinData.flatMap(group => group.pinyins);
