import styles from "./feature-video.module.css";

type FeatureVideoProps = { name: "writing" | "cardnews" | "repost" | "indexing"; title: string };

export function FeatureVideo({ name, title }: FeatureVideoProps) {
  return <figure className={styles.figure}>
    <video data-feature-video={name} src={`https://blogfactory.kr/detail/blog-factory/features/${name}.mp4`} width={860} height={484} preload="none" muted loop playsInline controls aria-label={title}>
      이 브라우저에서는 영상을 재생할 수 없습니다.
    </video>
    <figcaption>{title}</figcaption>
  </figure>;
}
