"""Activate three already-approved chest states. Never build or rewrite pixels.

The original v06 decision/Plan03 publication remains immutable history. This
forward overlay changes only current lifecycle metadata for actual consumers.
"""
from __future__ import annotations
import argparse
import copy
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "src/generated/mgjrpg02Art.ts"
MAP = ROOT / "docs/source-assets/publication/loot03b-chest-activation.json"
APPROVAL = "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json"
APPROVAL_HASH = "0efe136020a5116ad7df79b042e60aba786dc2925122a0a55cf6fe3aebf11e48"
MECHANICS = "docs/user-playtests/2026-09-06-physical-loot-and-account-level.md"
MECHANICS_HASH = "ce2acd10f1e851b8246b63d7737cffc0f662327ca98d6bbd106784cae7eccdea"
ALLOW = {
    "classic-mimic-closed": ("292da436e91f13090647339dd625009e2c560a5519edfdc114c50d07ce673915", "c9a2f5d6f46f224f2bfdd0d1d4846545da5d61e13ab28b0341c6c963747e8d3b"),
    "classic-mimic-good-open": ("c21d94597d0600889a21fd2c5886b67944b3b8ac855f10a33f5032e46ec151db", "88a8c0c95837696b9120d0d7a2e2ee70250fb8c796410fab7d2d7845141f7e12"),
    "candy-mimic-closed": ("dc05abc175da18773ea5d68bc54560cc9197cb9dfbc608a2ad4e8ad3e4558005", "dcbf7967722258a6ad24f308717ae2dd41472b0a4f8bf260a154d23975732a4c"),
}
def checked(path, expected):
    data=(ROOT/path).read_bytes()
    if hashlib.sha256(data).hexdigest()!=expected:
        raise ValueError(f"Immutable input drift: {path}")
    return len(data)

def main():
    parser=argparse.ArgumentParser()
    modes=parser.add_mutually_exclusive_group(required=True)
    modes.add_argument("--publish",action="store_true")
    modes.add_argument("--check",action="store_true")
    args=parser.parse_args()
    checked(APPROVAL,APPROVAL_HASH)
    checked(MECHANICS,MECHANICS_HASH)
    pending=[]; rows=[]; registry=REGISTRY.read_text(encoding="utf-8")
    for identity,(source_hash,runtime_hash) in ALLOW.items():
        path=ROOT/f"docs/source-assets/records/{identity}-mgjrpg02-v01-source.json"
        record=json.loads(path.read_text(encoding="utf-8"))
        if record["approvalStatus"]!="approved" or record["approvalEvidence"]["evidenceSha256"]!=APPROVAL_HASH:
            raise ValueError(f"Unapproved identity: {identity}")
        if record["id"]!=identity or len(record["derivatives"])!=1: raise ValueError("Unexpected record")
        source=record["sources"][0]; derivative=record["derivatives"][0]
        if source["sha256"]!=source_hash or derivative["sha256"]!=runtime_hash: raise ValueError("Hash contract changed")
        checked(source["path"],source_hash); size=checked(derivative["path"],runtime_hash)
        if size!=derivative["bytes"]: raise ValueError("Byte contract changed")
        for status in [record["runtimeStatus"],derivative["runtimeStatus"]]:
            if status not in ("dormant","active"): raise ValueError("Unexpected lifecycle state")
        updated=copy.deepcopy(record)
        updated["runtimeStatus"]="active"
        updated["derivatives"][0]["runtimeStatus"]="active"
        updated["derivatives"][0]["loadingPhase"]="current-level-only"
        line=re.compile(r'(^\s*"'+re.escape(identity)+r'": \{[^\n]+runtimeStatus: ")(dormant|active)("[^\n]*$)',re.M)
        found=line.findall(registry)
        if len(found)!=1: raise ValueError(f"Registry identity mismatch: {identity}")
        matched=line.search(registry).group(0)
        for literal in [f'src: "/{derivative["path"].removeprefix("public/")}"',
                        f'sourceRecordId: "{record["recordId"]}"',
                        f'width: {derivative["width"]}', f'height: {derivative["height"]}']:
            if literal not in matched: raise ValueError(f"Registry tuple drift: {identity}: {literal}")
        if args.check and (record!=updated or found[0][1]!="active"): raise ValueError(f"Activation drift: {identity}")
        registry=line.sub(lambda m:m[1]+"active"+m[3],registry)
        pending.append((path,(json.dumps(updated,indent=2,ensure_ascii=False)+"\n").encode()))
        rows.append({"id":identity,"recordId":record["recordId"],"source":source["path"],"sourceSha256":source_hash,
                     "runtime":derivative["path"],"runtimeSha256":runtime_hash,"bytes":size,
                     "previousStatus":"dormant","runtimeStatus":"active","loadingPhase":"current-level-only"})
    result={"id":"LOOT-03B-chest-activation","artApproval":{"path":APPROVAL,"sha256":APPROVAL_HASH},
            "mechanicsAuthority":{"path":MECHANICS,"sha256":MECHANICS_HASH},"implementation":"docs/plans/LOOT-03B-authored-chests-and-mimics.md",
            "scope":"Metadata activation only; original art approval and all source/runtime pixels unchanged.",
            "unchangedDormant":["classic-mimic-revealed","candy-mimic-good-open"],"entries":rows}
    encoded=(json.dumps(result,indent=2,ensure_ascii=False)+"\n").encode()
    if args.check:
        if not MAP.exists() or json.loads(MAP.read_text(encoding="utf-8"))!=result: raise ValueError("Activation map drift")
    else:
        if MAP.exists() and json.loads(MAP.read_text(encoding="utf-8"))!=result: raise ValueError("Refusing to overwrite another activation map")
        # All identities/pixels have passed before the first mutation.
        for path,data in pending: path.write_bytes(data)
        REGISTRY.write_bytes(registry.encode())
        MAP.write_bytes(encoded)
    print("LOOT-03B: three exact approved states active; no pixel or historical-decision changes")

if __name__=="__main__": main()
