import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from audit_lean import scan, entries_from_directory

class AuditTests(unittest.TestCase):
    def test_closure_and_patterns(self):
        with tempfile.TemporaryDirectory() as d:
            src = Path(d)/"src"
            src.mkdir()
            (src/"Main.lean").write_text("import Statements\nimport Foo\ntheorem example : True := trivial\n", encoding="utf-8")
            (src/"Statements.lean").write_text("def P : Prop := True\n", encoding="utf-8")
            (src/"Foo.lean").write_text("lemma y : True := by sorry\n", encoding="utf-8")
            (src/"Unused.lean").write_text("def Q : Prop := False\n", encoding="utf-8")
            result = scan(entries_from_directory(Path(d)))
            self.assertEqual(result["counts"]["lean_files"], 4)
            self.assertEqual(result["counts"]["reachable_from_Main"], 3)
            self.assertEqual(result["counts"]["not_reachable_from_Main"], 1)
            self.assertEqual(result["counts"]["flag_unfinished_proof"], 1)
            self.assertTrue(result["roots_present"]["Main"])

if __name__ == "__main__":
    unittest.main()
