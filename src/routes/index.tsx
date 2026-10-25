import { createFileRoute } from "@tanstack/react-router";
import { RiskHome } from "@/components/risk-guardian";
export const Route = createFileRoute("/")({
 head:()=>({meta:[{title:"MyRidius FCRM | Work queue"},{name:"description",content:"AI-assisted financial crime risk assessment workbench."},{property:"og:title",content:"MyRidius FCRM Workbench"},{property:"og:description",content:"AI drafts, humans decide, everything is logged."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:RiskHome,
});
