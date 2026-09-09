"use client";

import { useState } from "react";
import { adminOp } from "@/lib/admin-client";
import { Btn, Card, Field, Input, PageHeader, useToast } from "./ui";

export function SecurityPanel() {
  const toast = useToast();
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function savePwd(e: React.FormEvent) {
    e.preventDefault();
    if (pwd !== pwd2) return toast("Les deux mots de passe diffèrent", "err");
    setBusy("pwd");
    try {
      await adminOp("set_password", { next: pwd });
      toast("Mot de passe modifié");
      setPwd(""); setPwd2("");
    } catch (err) { toast(err instanceof Error ? err.message : "Erreur", "err"); } finally { setBusy(null); }
  }
  async function savePin(e: React.FormEvent) {
    e.preventDefault();
    setBusy("pin");
    try {
      await adminOp("set_staff_pin", { next: pin });
      toast("PIN cuisine modifié");
      setPin("");
    } catch (err) { toast(err instanceof Error ? err.message : "Erreur", "err"); } finally { setBusy(null); }
  }
  return (
    <div>
      <PageHeader title="Sécurité" sub="Deux accès distincts : le mot de passe du centre de contrôle (vous) et le PIN de l'écran cuisine (l'équipe)." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <form onSubmit={savePwd} className="space-y-4">
            <h2 className="font-display text-xl font-bold text-ink">Mot de passe du centre de contrôle</h2>
            <Field label="Nouveau mot de passe" hint="6 caractères minimum."><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} minLength={6} required /></Field>
            <Field label="Confirmer"><Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} minLength={6} required /></Field>
            <Btn disabled={busy === "pwd" || pwd.length < 6}>{busy === "pwd" ? "…" : "Enregistrer"}</Btn>
          </form>
        </Card>
        <Card>
          <form onSubmit={savePin} className="space-y-4">
            <h2 className="font-display text-xl font-bold text-ink">PIN de l&apos;écran cuisine</h2>
            <Field label="Nouveau PIN" hint="4 à 8 chiffres. À partager avec l'équipe en salle et en cuisine."><Input inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} required /></Field>
            <Btn disabled={busy === "pin" || pin.length < 4}>{busy === "pin" ? "…" : "Enregistrer"}</Btn>
          </form>
        </Card>
      </div>
      <p className="mt-6 text-xs text-muted">Après 20 essais infructueux en 10 minutes, les deux accès se verrouillent pendant 10 minutes.</p>
    </div>
  );
}
