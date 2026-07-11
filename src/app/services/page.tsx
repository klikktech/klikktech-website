"use client";

import { useEffect } from "react";

export default function ServicesRedirectPage() {
  useEffect(() => {
    window.location.replace("/#services");
  }, []);

  return null;
}
