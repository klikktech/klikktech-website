import { Tag } from "@/components/atoms/tag";
import { FEATURE_LABELS, resolveFeatures, type FeatureKey } from "@/core/logic/feature-keys";

type AdminEffectiveFeaturesProps = {
  enabledAddons: unknown;
  featureOverrides: unknown;
};

export function AdminEffectiveFeatures({ enabledAddons, featureOverrides }: AdminEffectiveFeaturesProps) {
  const features = resolveFeatures({ enabledAddons, featureOverrides });
  const sorted = [...features].sort();

  if (sorted.length === 0) {
    return <p className="text-body-sm text-on-surface-variant">No features enabled.</p>;
  }

  return (
    <div className="flex flex-wrap gap-sm">
      {sorted.map((key: FeatureKey) => (
        <Tag key={key} title={key}>
          {FEATURE_LABELS[key]}
        </Tag>
      ))}
    </div>
  );
}
