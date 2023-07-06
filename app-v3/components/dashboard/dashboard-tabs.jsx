import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DashboardOverview from "./dashboard-overview";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="harvests">Harvests</TabsTrigger>
        <TabsTrigger value="waste">Waste</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <DashboardOverview />
      </TabsContent>
      <TabsContent value="sales">Sales Overview</TabsContent>
      <TabsContent value="harvests">Harvests Overview</TabsContent>
      <TabsContent value="waste">Waste Overview</TabsContent>
      <TabsContent value="training">Training Overview</TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
