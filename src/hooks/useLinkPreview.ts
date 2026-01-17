import { useState, useEffect, useMemo } from 'react';
import { extractUrls, createLinkPreview, createMediaEmbed, LinkPreview, MediaEmbed } from '../utils/linkPreview';

interface UseLinkPreviewResult {
    linkPreviews: Array<{ url: string; preview: LinkPreview }>;
    mediaEmbeds: MediaEmbed[];
}

/**
 * コンテンツからリンクプレビューとメディア埋め込みを抽出するフック
 * PostCard.tsxとPostForm.tsxで重複していたロジックを統合
 */
export const useLinkPreview = (content: string): UseLinkPreviewResult => {
    const [linkPreviews, setLinkPreviews] = useState<Array<{ url: string; preview: LinkPreview }>>([]);
    const [mediaEmbeds, setMediaEmbeds] = useState<MediaEmbed[]>([]);

    // URLを抽出（メモ化）
    const urls = useMemo(() => extractUrls(content || ''), [content]);

    useEffect(() => {
        if (urls.length === 0) {
            setLinkPreviews([]);
            setMediaEmbeds([]);
            return;
        }

        const previews: Array<{ url: string; preview: LinkPreview }> = [];
        const embeds: MediaEmbed[] = [];

        for (const url of urls) {
            // メディア埋め込みを最初にチェック
            const mediaEmbed = createMediaEmbed(url);
            if (mediaEmbed) {
                embeds.push(mediaEmbed);
            } else {
                // メディアでない場合はリンクプレビューを作成
                const preview = createLinkPreview(url);
                previews.push({ url, preview });
            }
        }

        setLinkPreviews(previews);
        setMediaEmbeds(embeds);
    }, [urls]);

    return { linkPreviews, mediaEmbeds };
};

export default useLinkPreview;
