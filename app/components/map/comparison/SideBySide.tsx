import L from "leaflet";
import "leaflet-side-by-side";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface SideBySideProps {
  leftDate: string;
  rightDate: string;
  opacity: number;
  onTop: "left" | "right";
}

export default function SideBySide({
  leftDate,
  rightDate,
  opacity = 1.0,
  onTop = "left",
}: SideBySideProps) {
  const map = useMap();

  useEffect(() => {
    const leftLayer = L.tileLayer.wms("/wms", {
      attribution:
        '&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>',
      layers: "TRUE_COLOR",
      // @ts-expect-error Time is valid but not included in the type definition.
      time: leftDate,
      transparent: true,
      opacity: onTop === "left" ? opacity : undefined,
      zIndex: onTop === "left" ? 100 : undefined,
    });

    const rightLayer = L.tileLayer.wms("/wms", {
      attribution:
        '&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>',
      layers: "TRUE_COLOR",
      // @ts-expect-error Time is valid but not included in the type definition.
      time: rightDate,
      transparent: true,
      opacity: onTop === "right" ? opacity : undefined,
      zIndex: onTop === "right" ? 100 : undefined,
    });

    const sideBySideControl = L.control.sideBySide(leftLayer, rightLayer);

    // @ts-expect-error This is a really weird hack but works nonetheless.
    const updateClip = sideBySideControl._updateClip.bind(sideBySideControl);
    // @ts-expect-error The hack continues.
    sideBySideControl._updateClip = () => {
      // Call the original "_updateClip()".
      updateClip();

      if (onTop === "left") {
        // @ts-expect-error Accessing "private" variables.
        if (sideBySideControl._rightLayer) {
          // @ts-expect-error And unset it's clip rect.
          sideBySideControl._rightLayer.getContainer().style.clip = "unset";
        }
      } else if (onTop === "right") {
        // @ts-expect-error Accessing "private" variables.
        if (sideBySideControl._leftLayer) {
          // @ts-expect-error And unset it's clip rect.
          sideBySideControl._leftLayer.getContainer().style.clip = "unset";
        }
      }
    };

    // Add controls and layers to the map
    sideBySideControl.addTo(map);
    leftLayer.addTo(map);
    rightLayer.addTo(map);

    // Clean up on unmount to ensure fresh rerender
    return () => {
      map.removeControl(sideBySideControl);
      map.removeLayer(leftLayer);
      map.removeLayer(rightLayer);
    };
  }, [map, leftDate, rightDate, onTop, opacity]);

  return null;
}
