import { useQuery } from '@tanstack/react-query';

import { getEcologicalImpactByIriQuery } from 'lib/queries/react-query/sanity/getEcologicalImpactByIriQuery/getEcologicalImpactByIriQuery';

import { Maybe } from '../../../../generated/graphql';
import { EcologicalImpact } from '../../../../generated/sanity-graphql';
import { client } from '../../../../lib/clients/sanity';

interface InputProps {
  coBenefitsIris: Maybe<string | string[]> | undefined;
  primaryImpactIRI: string[];
}

export default function useImpact({
  coBenefitsIris,
  primaryImpactIRI,
}: InputProps): EcologicalImpact[] {
  const { data: primaryImpactData } = useQuery(
    getEcologicalImpactByIriQuery({
      iris: primaryImpactIRI?.filter(Boolean),
      sanityClient: client,
      enabled: !!primaryImpactIRI,
    }),
  );

  const { data: coBenefitData } = useQuery(
    getEcologicalImpactByIriQuery({
      iris: coBenefitsIris,
      sanityClient: client,
      enabled: !!coBenefitsIris,
    }),
  );

  let impactData: EcologicalImpact[] = [];

  if (primaryImpactData && primaryImpactData.allEcologicalImpact?.length) {
    impactData = [...primaryImpactData?.allEcologicalImpact];
  }

  if (coBenefitData && coBenefitData.allEcologicalImpact?.length) {
    impactData = [...impactData, ...coBenefitData?.allEcologicalImpact];
  }

  return impactData;
}
