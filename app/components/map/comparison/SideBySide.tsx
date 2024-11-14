import L from "leaflet";
import "leaflet-side-by-side";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface SideBySideProps {
  leftDate: string;
  rightDate: string;
}

export default function SideBySide({ leftDate, rightDate }: SideBySideProps) {
  const map = useMap();

  useEffect(() => {
    const leftLayer = L.tileLayer.wms("/wms", {
      attribution:
        '&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>',
      layers: "TRUE_COLOR",
      // @ts-expect-error Time is valid but not included in the type definition.
      time: leftDate,
      transparent: true,
    });

    const rightLayer = L.tileLayer.wms("/wms", {
      attribution:
        '&copy; <a href="https://dataspace.copernicus.eu/" target="_blank">Copernicus Data Space Ecosystem</a>',
      layers: "TRUE_COLOR",
      // @ts-expect-error Time is valid but not included in the type definition.
      time: rightDate,
      transparent: true,
    });

    const sideBySideControl = L.control.sideBySide(leftLayer, rightLayer);

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
  }, [map, leftDate, rightDate]);

  return null;
}
