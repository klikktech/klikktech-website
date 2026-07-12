"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { Input } from "@/components/atoms/input";
import { FormField } from "@/components/molecules/form-field";

interface AddressAutocompleteProps {
  id?: string;
  defaultAddress?: string;
  defaultLatitude?: number | null;
  defaultLongitude?: number | null;
  required?: boolean;
  onAddressChange?: (address: string) => void;
}

let placesPromise: Promise<google.maps.PlacesLibrary> | null = null;

function loadPlacesLibrary(): Promise<google.maps.PlacesLibrary> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not configured."));
  }
  if (!placesPromise) {
    setOptions({ key: apiKey, libraries: ["places"] });
    placesPromise = importLibrary("places");
  }
  return placesPromise;
}

function readCoordinate(value: number | (() => number) | undefined): string {
  if (value == null) return "";
  return String(typeof value === "function" ? value() : value);
}

export function AddressAutocomplete({
  id = "storeAddress",
  defaultAddress = "",
  defaultLatitude = null,
  defaultLongitude = null,
  required,
  onAddressChange,
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const onAddressChangeRef = useRef(onAddressChange);
  const [address, setAddress] = useState(defaultAddress);
  const [latitude, setLatitude] = useState(defaultLatitude != null ? String(defaultLatitude) : "");
  const [longitude, setLongitude] = useState(defaultLongitude != null ? String(defaultLongitude) : "");
  const [useFallback, setUseFallback] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  onAddressChangeRef.current = onAddressChange;

  useEffect(() => {
    setAddress(defaultAddress);
    setLatitude(defaultLatitude != null ? String(defaultLatitude) : "");
    setLongitude(defaultLongitude != null ? String(defaultLongitude) : "");
  }, [defaultAddress, defaultLatitude, defaultLongitude]);

  function updateAddress(next: string) {
    setAddress(next);
    onAddressChangeRef.current?.(next);
  }

  useEffect(() => {
    let cancelled = false;

    loadPlacesLibrary()
      .then((places) => {
        if (cancelled || !containerRef.current) return;

        const widget = new places.PlaceAutocompleteElement({
          includedPrimaryTypes: ["street_address", "premise", "subpremise"],
          placeholder: "Start typing your store address",
        });

        widget.id = id;
        widget.value = defaultAddress;
        widget.style.width = "100%";
        widget.style.borderRadius = "0.5rem";
        widget.style.border = "1px solid var(--outline-variant)";
        widget.style.backgroundColor = "var(--surface-container-lowest)";
        widget.style.fontSize = "1rem";
        widget.style.color = "var(--on-surface)";

        const handleSelect = async (event: Event) => {
          const selectEvent = event as google.maps.places.PlacePredictionSelectEvent;
          const place = selectEvent.placePrediction.toPlace();
          await place.fetchFields({ fields: ["formattedAddress", "location"] });

          const formatted = place.formattedAddress ?? widget.value;
          widget.value = formatted;
          updateAddress(formatted);

          const location = place.location;
          if (location) {
            setLatitude(readCoordinate(location.lat));
            setLongitude(readCoordinate(location.lng));
          }
        };

        const handleInput = () => {
          updateAddress(widget.value);
          setLatitude("");
          setLongitude("");
        };

        widget.addEventListener("gmp-select", handleSelect);
        widget.addEventListener("input", handleInput);

        containerRef.current.replaceChildren(widget);
        widgetRef.current = widget;
      })
      .catch((err) => {
        if (!cancelled) {
          setUseFallback(true);
          setLoadError(err instanceof Error ? err.message : "Failed to load address autocomplete.");
        }
      });

    return () => {
      cancelled = true;
      widgetRef.current?.remove();
      widgetRef.current = null;
    };
  }, [defaultAddress, id]);

  return (
    <FormField id={id} label="Store address">
      {useFallback ? (
        <Input
          id={id}
          name="storeAddress"
          required={required}
          value={address}
          autoComplete="street-address"
          placeholder="Enter your store address"
          onChange={(event) => {
            updateAddress(event.target.value);
            setLatitude("");
            setLongitude("");
          }}
        />
      ) : (
        <>
          <div ref={containerRef} className="min-h-[2.75rem] w-full" />
          <input type="hidden" name="storeAddress" value={address} />
        </>
      )}
      <input type="hidden" name="storeLatitude" value={latitude} />
      <input type="hidden" name="storeLongitude" value={longitude} />
      {loadError ? (
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Autocomplete unavailable — you can still enter the address manually. ({loadError})
        </p>
      ) : null}
    </FormField>
  );
}
