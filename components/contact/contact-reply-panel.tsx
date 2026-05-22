"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";

import { api } from "@/lib/api";
import {
  buildContactMailto,
  formatReplyAuthor,
  getReplyTimestamp,
  sortRepliesNewestFirst,
  type ContactInquiryLike,
} from "@/lib/contact-inquiry";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type ContactReplyPanelProps = {
  contactId: string | null;
  contact: ContactInquiryLike | null;
  detailQueryKey: readonly unknown[];
  listQueryKey?: readonly unknown[];
};

function formatSentAt(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

export function ContactReplyPanel({
  contactId,
  contact,
  detailQueryKey,
  listQueryKey,
}: ContactReplyPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyDraft, setReplyDraft] = useState("");

  useEffect(() => {
    setReplyDraft("");
  }, [contactId]);

  const replies = useMemo(
    () => sortRepliesNewestFirst(contact?.replies),
    [contact?.replies]
  );

  const mailtoHref = useMemo(
    () => (contact ? buildContactMailto(contact) : ""),
    [contact]
  );

  const saveReplyMutation = useMutation({
    mutationFn: (body: string) => {
      if (!contactId) throw new Error("Invalid contact id");
      return api.createContactReply(contactId, { body, channel: "email" });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...detailQueryKey] });
      await queryClient.refetchQueries({ queryKey: [...detailQueryKey] });
      if (listQueryKey) {
        await queryClient.invalidateQueries({ queryKey: [...listQueryKey] });
      }
      setReplyDraft("");
      toast({
        title: "Reply saved",
        description: "The reply was recorded and the inquiry marked as replied.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to save reply.",
        variant: "destructive",
      });
    },
  });

  function handleSaveReply() {
    const body = replyDraft.trim();
    if (!contactId) {
      toast({
        title: "Error",
        description: "Invalid contact id",
        variant: "destructive",
      });
      return;
    }
    if (body.length < 1) {
      toast({
        title: "Reply required",
        description: "Paste or type the reply you sent so it appears in the audit trail.",
        variant: "destructive",
      });
      return;
    }
    saveReplyMutation.mutate(body);
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <div>
        <div className="text-sm font-medium mb-2">Admin replies</div>
        {replies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {replies.map((reply, index) => (
              <li
                key={reply.id || `${getReplyTimestamp(reply)}-${index}`}
                className="rounded-md border p-3 text-sm space-y-1"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatSentAt(getReplyTimestamp(reply))}</span>
                  <span>·</span>
                  <span>{formatReplyAuthor(reply)}</span>
                  {reply.channel ? (
                    <>
                      <span>·</span>
                      <span className="capitalize">{reply.channel}</span>
                    </>
                  ) : null}
                </div>
                <p className="whitespace-pre-wrap">{reply.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Record reply</div>
        <p className="text-xs text-muted-foreground">
          Use Reply via email to compose in your mail app, then save the text you sent here for the audit trail.
        </p>
        <Textarea
          placeholder="Paste the reply you sent to the user..."
          value={replyDraft}
          onChange={(e) => setReplyDraft(e.target.value)}
          rows={4}
          disabled={saveReplyMutation.isPending || !contactId}
        />
        <div className="flex flex-wrap items-center gap-2 justify-end">
          {mailtoHref ? (
            <Button asChild variant="outline" type="button">
              <a href={mailtoHref}>
                <Mail className="h-4 w-4 mr-2" />
                Reply via email
              </a>
            </Button>
          ) : (
            <Button variant="outline" type="button" disabled>
              <Mail className="h-4 w-4 mr-2" />
              Reply via email
            </Button>
          )}
          <Button
            type="button"
            disabled={saveReplyMutation.isPending || !contactId}
            onClick={handleSaveReply}
          >
            Save reply
          </Button>
        </div>
      </div>
    </div>
  );
}
