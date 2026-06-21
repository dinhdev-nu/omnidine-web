import type { CommunicationFeature, IconFeature } from "./landing-main.data"
import { CheckListItem } from "./CheckListItem"

export function CommunicationFeatureCard({
  feature,
}: {
  feature: CommunicationFeature
}) {
  return (
    <article className="flex min-h-96 w-full max-w-[380px] flex-col rounded-lg border border-[--border] bg-[--surface-secondary] p-px sm:max-w-full md:w-full md:flex-row md:odd:flex-row-reverse xl:gap-16 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
      <figure className="p-2 md:h-auto md:w-[360px] lg:w-[480px] xl:w-[560px]">
        <img
          alt=""
          className="sf-hidden block hidden aspect-video h-[200px] w-full rounded-lg border border-[--border] object-cover md:h-full dark:block dark:border-[--dark-border]"
          data-nimg={1}
          decoding="async"
          height={374}
          loading="lazy"
          src="data:,"
          style={{ color: "transparent" }}
          width={560}
        />
        <img
          alt=""
          className="block aspect-video h-[200px] w-full rounded-lg border border-[--border] object-cover md:h-full dark:hidden dark:border-[--dark-border]"
          data-nimg={1}
          decoding="async"
          height={374}
          loading="lazy"
          src={feature.imageSrc}
          style={{ color: "transparent" }}
          width={560}
        />
      </figure>
      <div className="flex flex-col gap-8 p-5 pt-6 md:flex-1 md:p-10">
        <div className="flex flex-col items-start gap-2">
          <h5 className="text-2xl font-medium text-[--text-primary] md:text-3xl dark:text-[--dark-text-primary]">
            {feature.title}
          </h5>
          <p className="font-normal text-[--text-secondary] md:text-lg dark:text-[--dark-text-secondary]">
            {feature.description}
          </p>
        </div>
        <ul className="flex flex-col items-start gap-3 pl-2 md:text-lg">
          {feature.bullets.map((bullet) => (
            <CheckListItem key={bullet}>{bullet}</CheckListItem>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function ManagementFeatureCard({ feature }: { feature: IconFeature }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[--border] p-4 [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:border-[--dark-border] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]">
      <figure className="flex size-9 items-center justify-center rounded-full border border-[--border] bg-[--surface-secondary] p-2 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
        <img
          alt={feature.iconAlt}
          className="dark:invert"
          data-nimg={1}
          decoding="async"
          height={18}
          loading="lazy"
          src={feature.iconSrc}
          style={{ color: "transparent" }}
          width={18}
        />
      </figure>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-lg font-medium">{feature.title}</h5>
        <p className="text-pretty text-[--text-secondary] dark:text-[--dark-text-secondary]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}

export function CollaborationFeatureCard({
  feature,
}: {
  feature: IconFeature
}) {
  return (
    <article className="flex flex-col gap-4">
      <figure className="flex size-9 items-center justify-center rounded-full border border-[--border] bg-[--surface-secondary] p-2 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
        <img
          alt={feature.iconAlt}
          className="dark:invert"
          data-nimg={1}
          decoding="async"
          height={18}
          loading="lazy"
          src={feature.iconSrc}
          style={{ color: "transparent" }}
          width={18}
        />
      </figure>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-lg font-medium">{feature.title}</h5>
        <p className="text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}

export function ProductivityFeatureCard({ feature }: { feature: IconFeature }) {
  return (
    <article className="flex w-[280px] shrink-0 flex-col gap-4 rounded-lg border border-[--border] bg-[--surface-secondary] p-4 lg:w-full lg:flex-row lg:p-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
      <figure className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[--surface-tertiary] p-3 dark:bg-[--dark-surface-tertiary]">
        <img
          alt={feature.iconAlt}
          className="dark:invert"
          data-nimg={1}
          decoding="async"
          height={24}
          loading="lazy"
          src={feature.iconSrc}
          style={{ color: "transparent" }}
          width={24}
        />
      </figure>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-lg font-medium">{feature.title}</h5>
        <p className="text-pretty text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}
