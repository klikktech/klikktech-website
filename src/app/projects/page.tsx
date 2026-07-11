"use client";

import { useEffect } from "react";

export default function ProjectsRedirectPage() {
  useEffect(() => {
    window.location.replace("/#projects");
  }, []);

  return null;
}
