import React from "react"
import { TESTIMONIALS } from "./landing-main.data"

export function TestimonialsSection() {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" })
    }
  }
  return (
    <div className="relative overflow-clip">
      <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
        <div className="flex w-full flex-col gap-14">
          <div className="flex justify-between">
            <div className="flex flex-col items-start gap-3 self-start self-stretch">
              <div className="flex max-w-[800px] flex-col items-start justify-center gap-1 self-start [&>*]:text-left [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
                <h4 title="Khách hàng nói gì">Hơn 1200 Đối Tác Tin Dùng</h4>
              </div>
            </div>
            <div className="hidden gap-4 sm:flex">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={scrollLeft}
                className="inline-flex !h-auto h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-3.5 px-4 py-2 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
              >
                <svg
                  className="size-6"
                  fill="none"
                  height={15}
                  viewBox="0 0 15 15"
                  width={15}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M6.85 3.15C7.05 3.34 7.05 3.66 6.85 3.85L3.71 7H12.5C12.78 7 13 7.22 13 7.5C13 7.78 12.78 8 12.5 8H3.71L6.85 11.15C7.05 11.34 7.05 11.66 6.85 11.85C6.66 12.05 6.34 12.05 6.15 11.85L2.15 7.85C1.95 7.66 1.95 7.34 2.15 7.15L6.15 3.15C6.34 2.95 6.66 2.95 6.85 3.15Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={scrollRight}
                className="inline-flex !h-auto h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] !px-4 px-3.5 !py-2 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
              >
                <svg
                  className="size-6"
                  fill="none"
                  height={15}
                  viewBox="0 0 15 15"
                  width={15}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M8.15 3.15C8.34 2.95 8.66 2.95 8.85 3.15L12.85 7.15C13.05 7.34 13.05 7.66 12.85 7.85L8.85 11.85C8.66 12.05 8.34 12.05 8.15 11.85C7.95 11.66 7.95 11.34 8.15 11.15L11.29 8H2.5C2.22 8 2 7.78 2 7.5C2 7.22 2.22 7 2.5 7H11.29L8.15 3.85C7.95 3.66 7.95 3.34 8.15 3.15Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={scrollRef}
              className="relative no-scrollbar flex h-full w-full snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth md:gap-0"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="max-w-full min-w-0 shrink-0 grow-0 basis-[min(740px,100%)] snap-center self-stretch md:pr-10"
                >
                  <article className="embla__slide !last:visible flex h-full w-full min-w-0 transform touch-pan-y touch-pinch-zoom flex-col rounded-xl border border-[--border] select-none [backface-visibility:hidden] dark:border-[--dark-border]">
                    <div className="flex flex-1 items-start border-b border-[--border] px-5 py-[18px] md:px-8 md:py-7 dark:border-[--dark-border]">
                      <blockquote className="text-xl leading-[135%] font-extralight text-pretty whitespace-pre-wrap text-[--text-primary] sm:text-2xl md:text-4xl dark:text-[--dark-text-primary]">
                        {testimonial.text}
                      </blockquote>
                    </div>
                    <div className="flex items-center gap-4 pl-5">
                      <div className="flex flex-1 items-center gap-5 border-r border-[--border] py-4 dark:border-[--dark-border]">
                        {testimonial.avatarStyle ? (
                          <img
                            alt={testimonial.name}
                            className="hidden size-16 rounded-full md:block"
                            data-nimg={1}
                            decoding="async"
                            height={64}
                            loading="lazy"
                            src={testimonial.avatarSrc}
                            style={testimonial.avatarStyle}
                            width={64}
                          />
                        ) : (
                          <img
                            alt={testimonial.name}
                            className="hidden size-16 rounded-full md:block"
                            data-nimg={1}
                            decoding="async"
                            height={64}
                            loading="lazy"
                            src={testimonial.avatarSrc}
                            style={{ color: "transparent" }}
                            width={64}
                          />
                        )}
                        <div className="flex flex-1 flex-col">
                          <h5 className="text-base font-medium md:text-lg">
                            {testimonial.name}
                          </h5>
                          <p className="text-sm text-pretty text-[--text-tertiary] md:text-base dark:text-[--dark-text-tertiary]">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="pr-5">
                        <img
                          alt={testimonial.companyAlt}
                          className="w-12 md:w-16"
                          data-nimg={1}
                          decoding="async"
                          height={48}
                          loading="lazy"
                          src={testimonial.companySrc}
                          style={{ color: "transparent" }}
                          width={testimonial.companyWidth}
                        />
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            <div className="sf-hidden mt-4 flex w-full justify-center gap-2 md:hidden"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
