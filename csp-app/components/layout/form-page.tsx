import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = {
  label: string;
  to?: string;
};

export function FormPage({
  crumbs,
  title,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="px-8 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {isLast || !crumb.to ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.to}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
        {title}
      </h1>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {children}
      </div>
    </main>
  );
}

export function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}{" "}
      <span className="text-destructive" aria-hidden="true">
        *
      </span>
    </label>
  );
}
