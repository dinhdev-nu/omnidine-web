import { memo } from "react"
import { Link } from "react-router-dom"
import {
  Bookmark,
  Check,
  Ellipsis,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Star,
} from "lucide-react"

import AppImage from "@/components/AppImage"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { FeedPost } from "../types"

const VIETNAMESE_NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN")

interface PostCardProps {
  post: FeedPost
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
}

function getImageContainerClass(totalImages: number, index: number): string {
  if (totalImages === 1) {
    return "relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]"
  }

  if (totalImages === 3 && index === 0) {
    return "relative col-span-2 aspect-[2/1] overflow-hidden"
  }

  return "relative aspect-square overflow-hidden"
}

function PostCardComponent({ post, onLike, onBookmark }: PostCardProps) {
  const restaurantHref = `/public/restaurants/${post.restaurant.slug}`

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:bg-accent/15 motion-reduce:transition-none">
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Link
              to={restaurantHref}
              className="relative shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label={`Mở chi tiết ${post.restaurant.name}`}
            >
              <AppImage
                src={post.restaurant.avatar}
                alt={post.restaurant.name}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover ring-2 ring-border"
                loading="lazy"
              />
              {post.restaurant.verified && (
                <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 ring-2 ring-background">
                  <Check aria-hidden="true" className="size-3 text-white" />
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                to={restaurantHref}
                className="-my-2.5 block min-h-11 max-w-full touch-manipulation rounded-md py-2.5 text-left focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                aria-label={`Mở chi tiết ${post.restaurant.name}`}
              >
                <h3 className="truncate font-semibold text-foreground">
                  {post.restaurant.name}
                </h3>
              </Link>
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="shrink-0">{post.timestamp}</span>
                <span aria-hidden="true" className="hidden sm:inline">
                  •
                </span>
                <span className="flex max-w-full min-w-0 basis-full items-center sm:basis-auto">
                  <MapPin
                    aria-hidden="true"
                    className="mr-1 size-3 shrink-0 text-red-500"
                  />
                  <span className="truncate">{post.restaurant.location}</span>
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Hành động bài viết"
                className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
              >
                <Ellipsis aria-hidden="true" className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border border-border bg-popover"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer px-4 py-2 text-sm text-foreground"
                  onSelect={() => onBookmark(post.id)}
                >
                  <Bookmark aria-hidden="true" />
                  <span>{post.bookmarked ? "Bỏ lưu" : "Lưu bài viết"}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mb-3 leading-relaxed break-words text-foreground/90">
          {post.content}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags?.map((tag, index) => (
            <span
              key={`${post.id}-${tag}-${index}`}
              className="inline-flex max-w-full items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium break-all text-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {post.promotion && (
          <div className="mb-4 rounded-2xl border-2 border-primary/60 bg-background p-4">
            <div className="flex flex-col gap-3 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  KHUYẾN MÃI
                </p>
                <p className="text-2xl font-bold break-words text-foreground">
                  {post.promotion.discount} OFF
                </p>
              </div>
              <div className="min-w-0 min-[360px]:text-right">
                <p className="text-xs text-muted-foreground">Có hiệu lực đến</p>
                <p className="text-sm font-semibold break-words text-foreground">
                  {post.promotion.validUntil}
                </p>
              </div>
            </div>
          </div>
        )}

        {post.event && (
          <div className="mb-4 rounded-2xl border-2 border-primary/60 bg-background p-4">
            <div className="grid grid-cols-1 divide-y divide-border text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="min-w-0 py-2 sm:px-2 sm:py-0">
                <p className="mb-1 text-xs text-muted-foreground">Giá</p>
                <p className="text-lg font-bold break-words text-foreground">
                  {post.event.price}
                </p>
              </div>
              <div className="min-w-0 py-2 sm:px-2 sm:py-0">
                <p className="mb-1 text-xs text-muted-foreground">Thời gian</p>
                <p className="text-sm font-semibold break-words text-foreground">
                  {post.event.time}
                </p>
              </div>
              <div className="min-w-0 py-2 sm:px-2 sm:py-0">
                <p className="mb-1 text-xs text-muted-foreground">Đặc biệt</p>
                <p className="text-sm font-semibold break-words text-foreground">
                  {post.event.special}
                </p>
              </div>
            </div>
          </div>
        )}

        {post.customerFeedback && (
          <div className="mb-4 rounded-2xl border border-border bg-background p-4">
            <div className="flex min-w-0 items-start gap-3">
              <AppImage
                src={post.customerFeedback.avatar}
                alt={post.customerFeedback.name}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="min-w-0 truncate text-sm font-semibold text-foreground">
                    {post.customerFeedback.name}
                  </p>
                  <div
                    role="img"
                    aria-label={`${post.customerFeedback.rating} trên 5 sao`}
                    className="flex shrink-0 items-center gap-0.5"
                  >
                    {Array.from({ length: post.customerFeedback.rating }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className="size-4 fill-yellow-500 text-yellow-500"
                        />
                      )
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed break-words text-foreground/85 italic">
                  “{post.customerFeedback.comment}”
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {post.images && post.images.length > 0 && (
        <div
          className={`grid ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1`}
        >
          {post.images.slice(0, 4).map((image, index) => (
            <div
              key={image}
              className={getImageContainerClass(
                post.images?.length ?? 0,
                index
              )}
            >
              <AppImage
                src={image}
                alt={`Post image ${index + 1}`}
                width={1200}
                height={800}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none"
                loading="lazy"
              />
              {index === 3 && (post.images?.length ?? 0) > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white">
                    +{(post.images?.length ?? 0) - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border px-4 py-4 sm:px-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 font-medium tabular-nums">
              <Heart
                aria-hidden="true"
                className="size-5 fill-red-500 text-red-500"
              />
              <span>{VIETNAMESE_NUMBER_FORMATTER.format(post.likes)}</span>
            </span>
            <span className="tabular-nums">
              {VIETNAMESE_NUMBER_FORMATTER.format(post.comments)} bình luận
            </span>
          </div>
          <span className="tabular-nums">
            {VIETNAMESE_NUMBER_FORMATTER.format(post.shares)} chia sẻ
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onLike(post.id)}
            aria-label={post.liked ? "Bỏ thích bài viết" : "Thích bài viết"}
            aria-pressed={post.liked}
            className={cn(
              "flex min-h-11 min-w-0 touch-manipulation items-center justify-center gap-2 rounded-2xl border px-2 py-2.5 font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none",
              post.liked
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-secondary"
            )}
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "size-5 shrink-0",
                post.liked
                  ? "fill-primary-foreground text-primary-foreground"
                  : "text-foreground"
              )}
            />
            <span className="hidden text-sm min-[390px]:inline">Thích</span>
          </button>

          <button
            type="button"
            aria-label="Bình luận bài viết chưa khả dụng"
            title="Bình luận chưa khả dụng"
            disabled
            className="flex min-h-11 min-w-0 touch-manipulation items-center justify-center gap-2 rounded-2xl border border-border bg-background px-2 py-2.5 font-medium text-muted-foreground opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle
              aria-hidden="true"
              className="size-5 shrink-0 text-muted-foreground"
            />
            <span className="hidden text-sm min-[390px]:inline">Bình luận</span>
          </button>

          <button
            type="button"
            aria-label="Chia sẻ bài viết chưa khả dụng"
            title="Chia sẻ chưa khả dụng"
            disabled
            className="flex min-h-11 min-w-0 touch-manipulation items-center justify-center gap-2 rounded-2xl border border-border bg-background px-2 py-2.5 font-medium text-muted-foreground opacity-50 disabled:cursor-not-allowed"
          >
            <Share2
              aria-hidden="true"
              className="size-5 shrink-0 text-muted-foreground"
            />
            <span className="hidden text-sm min-[390px]:inline">Chia sẻ</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(PostCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.post === nextProps.post &&
    prevProps.onLike === nextProps.onLike &&
    prevProps.onBookmark === nextProps.onBookmark
  )
})
