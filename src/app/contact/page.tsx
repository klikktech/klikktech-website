"use client";

import { useEffect } from "react";

export default function ContactRedirectPage() {
  useEffect(() => {
    window.location.replace("/#contact");
  }, []);

  return null;
}
