import React, { useState, useEffect } from "react";
import {
  supportService,
  SupportTicket,
  CreateTicketData,
  FAQItem,
} from "@/api/services/support.service";
import { SupportTicketSystem } from "@/components/support/SupportTicketSystem";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageSquare,
  LifeBuoy,
  Search,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function Support() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [ticketStats, setTicketStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Load support data
  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const promises = [supportService.getFAQ()];

      if (isAuthenticated) {
        promises.push(
          supportService.getTickets() as any,
          supportService.getTicketStats() as any,
        );
      }

      const results = await Promise.all(promises);
      setFaqItems(results[0] as FAQItem[]);

      if (isAuthenticated && results.length > 1) {
        setTickets((results[1] as any).data || []);
        setTicketStats(results[2]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to load support data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupportData();
  }, [isAuthenticated]);

  // Handle ticket creation
  const handleCreateTicket = async (ticketData: Partial<SupportTicket>) => {
    try {
      const createData: CreateTicketData = {
        title: ticketData.title!,
        description: ticketData.description!,
        category: ticketData.category!,
        priority: ticketData.priority!,
      };

      const newTicket = await supportService.createTicket(createData);
      setTickets((prev) => [newTicket, ...prev]);

      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create ticket",
        variant: "destructive",
      });
    }
  };

  // Handle sending message
  const handleSendMessage = async (
    ticketId: string,
    content: string,
    attachments?: File[],
  ) => {
    try {
      const message = await supportService.addMessage(
        ticketId,
        content,
        attachments,
      );

      // Update ticket with new message
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, messages: [...ticket.messages, message] }
            : ticket,
        ),
      );

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Handle closing ticket
  const handleCloseTicket = async (ticketId: string) => {
    try {
      await supportService.closeTicket(ticketId, "Closed by user");

      // Update ticket status
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status: "closed" as const }
            : ticket,
        ),
      );

      toast({
        title: "Success",
        description: "Ticket closed successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to close ticket",
        variant: "destructive",
      });
    }
  };

  // Filter FAQ items
  const filteredFaqItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-8">
          <LifeBuoy className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and get help with Talkcon
          </p>
        </div>

        <PublicSupportContent
          faqItems={filteredFaqItems}
          faqSearch={faqSearch}
          setFaqSearch={setFaqSearch}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (isLoading) {
    return <SupportLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="mb-4">{error}</AlertDescription>
          </Alert>
          <Button
            onClick={loadSupportData}
            className="w-full mt-4"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground">
            Get help with your language learning journey
          </p>
        </div>
        <Button
          onClick={loadSupportData}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ & Help</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SupportOverview ticketStats={ticketStats} />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="h-[600px] border rounded-lg">
            <SupportTicketSystem
              tickets={tickets}
              currentUser={user!}
              onCreateTicket={handleCreateTicket}
              onSendMessage={handleSendMessage}
              onCloseTicket={handleCloseTicket}
            />
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <PublicSupportContent
            faqItems={filteredFaqItems}
            faqSearch={faqSearch}
            setFaqSearch={setFaqSearch}
            isLoading={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-components
function SupportOverview({ ticketStats }: { ticketStats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Tickets
              </p>
              <h3 className="text-2xl font-bold">{ticketStats?.total || 0}</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {ticketStats?.open || 0}
              </h3>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                In Progress
              </p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {ticketStats?.inProgress || 0}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Resolved
              </p>
              <h3 className="text-2xl font-bold text-green-600">
                {ticketStats?.resolved || 0}
              </h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PublicSupportContent({
  faqItems,
  faqSearch,
  setFaqSearch,
  isLoading,
}: {
  faqItems: FAQItem[];
  faqSearch: string;
  setFaqSearch: (value: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">User Guide</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Learn how to use Talkcon effectively
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Guide
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Chat with our support team
            </p>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Send us an email
            </p>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQ..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredFaqItems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No FAQ items found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SupportLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
